import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../../hooks/useAdmin';
import { DocumentService, SchoolDocument } from '../../../services/document';
import { SubjectService } from '../../../services/subject';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { AddDocumentModal } from '../../../components/admin/documents/AddDocumentModal';
import { auth } from '../../../config/firebase';
import type { Subject } from '../../../types';

export function ManageDocuments() {
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { adminService } = useAdmin();
  const documentService = DocumentService.getInstance();
  const subjectService = SubjectService.getInstance();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!auth.currentUser) return;
        
        const userDoc = await adminService.getUserById(auth.currentUser.uid);
        if (!userDoc?.schoolId) {
          setError('No school associated with this user');
          setLoading(false);
          return;
        }

        setSchoolId(userDoc.schoolId);
        await Promise.all([
          loadDocuments(userDoc.schoolId),
          loadSubjects(userDoc.schoolId)
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [adminService]);

  const loadDocuments = async (currentSchoolId: string) => {
    try {
      const schoolDocuments = await documentService.getSchoolDocuments(currentSchoolId);
      setDocuments(schoolDocuments);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents');
    }
  };

  const loadSubjects = async (currentSchoolId: string) => {
    try {
      const schoolSubjects = await subjectService.getSchoolSubjects(currentSchoolId);
      setSubjects(schoolSubjects);
    } catch (err) {
      console.error('Error loading subjects:', err);
      setError('Failed to load subjects');
    }
  };

  const handleUpload = async (file: File, subjectId: string) => {
    if (!schoolId) return;
  
    const data = new FormData();
    data.append('file', file);
    data.append('school', schoolId);
    data.append('subject', subjectId);
  
    try {
      setUploading(true);
      setError(null);

      const response = await fetch(`${API_URL}/vectorStore/upload`, {
        method: 'POST',
        body: data,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
  
      const result = await response.json();
  
      // Save document metadata to Firestore
      await documentService.addDocument(schoolId, {
        name: file.name,
        fileId: result.fileId,
        subjectId,
        uploadedBy: auth.currentUser?.uid || '',
      });
  
      // Refresh documents list
      await loadDocuments(schoolId);
      setSuccess('Document uploaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: SchoolDocument) => {
    console.log('Deleting document with:', { schoolId, fileId: document.fileId });
    if (!schoolId) return;
  
    try {
      setError(null);

      console.log(document);
      // Delete from vector store
      const response = await fetch(`${API_URL}/vectorStore/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          school: schoolId,
          fileId: document.fileId
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete document from vector store');
      }
  
      // Delete metadata from Firestore
      await documentService.deleteDocument(schoolId, document.id);
  
      // Refresh documents list
      await loadDocuments(schoolId);
      setSuccess('Document deleted successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Manage Documents</h2>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Upload and manage school documents</p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Document
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-mint/20 dark:bg-mint/10 border border-mint rounded-lg text-primary dark:text-dark-text">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-primary dark:text-dark-text-secondary">
            No documents uploaded yet. Click "Add Document" to get started.
          </div>
        ) : (
          documents.map(document => {
            const subject = subjects.find(s => s.id === document.subjectId);
            return (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 bg-sage/5 dark:bg-dark-surface rounded-lg border border-sage/10 dark:border-dark-border"
              >
                <div>
                  <h3 className="font-medium text-primary-dark dark:text-dark-text">
                    {document.name}
                  </h3>
                  <p className="text-sm text-primary dark:text-dark-text-secondary mt-1">
                    Subject: {subject?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-primary dark:text-dark-text-secondary">
                    Uploaded: {document.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(document)}
                  className="p-2 text-accent hover:text-accent-dark transition-colors duration-200"
                  title="Delete document"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {showUploadModal && (
        <AddDocumentModal
          isOpen={true}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          subjects={subjects}
          uploading={uploading}
        />
      )}
    </div>
  );
}