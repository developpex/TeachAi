import { useState, useEffect } from 'react';
import { Book, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../../hooks/useAdmin';
import { SubjectService } from '../../../services/subject';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { AddSubjectModal } from '../../../components/admin/subjects/AddSubjectModal';
import { auth } from '../../../config/firebase';
import { Subject } from '../../../types';

export function ManageSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const { adminService } = useAdmin();
  const subjectService = SubjectService.getInstance();

  useEffect(() => {
    const initializeSchoolId = async () => {
      try {
        if (!auth.currentUser) return;
        
        const userDoc = await adminService.getUserById(auth.currentUser.uid);
        if (!userDoc?.schoolId) {
          setError('No school associated with this user');
          setLoading(false);
          return;
        }

        setSchoolId(userDoc.schoolId);
        await loadSubjects(userDoc.schoolId);
      } catch (err) {
        console.error('Error initializing school ID:', err);
        setError('Failed to load school information');
        setLoading(false);
      }
    };

    initializeSchoolId();
  }, [adminService]);

  const loadSubjects = async (currentSchoolId: string) => {
    try {
      setLoading(true);
      const schoolSubjects = await subjectService.getSchoolSubjects(currentSchoolId);
      setSubjects(schoolSubjects);
      setError(null);
    } catch (err) {
      console.error('Error loading subjects:', err);
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (subject: Omit<Subject, 'id' | 'createdAt'>) => {
    if (!schoolId) {
      setError('No school ID available');
      return;
    }

    try {
      const newSubject = await subjectService.createSubject(schoolId, subject);
      setSubjects(prev => [...prev, newSubject]);
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      console.error('Error adding subject:', err);
      setError('Failed to add subject');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!schoolId) {
      setError('No school ID available');
      return;
    }

    try {
      await subjectService.deleteSubject(schoolId, subjectId);
      setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      setError(null);
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError('Failed to delete subject');
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
            <Book className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Manage Subjects</h2>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Add and manage school subjects</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Subject
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-primary dark:text-dark-text-secondary">
            No subjects added yet. Click "Add Subject" to get started.
          </div>
        ) : (
          subjects.map(subject => (
            <div
              key={subject.id}
              className="flex items-center justify-between p-4 bg-sage/5 dark:bg-dark-surface rounded-lg border border-sage/10 dark:border-dark-border"
            >
              <h3 className="font-medium text-primary-dark dark:text-dark-text">{subject.name}</h3>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="p-2 text-accent hover:text-accent-dark transition-colors duration-200"
                title="Delete subject"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <AddSubjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubject}
      />
    </div>
  );
}