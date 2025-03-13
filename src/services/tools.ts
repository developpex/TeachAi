import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import type { Tool } from '../types';
import { PLAN } from "../utils/constants.ts";

export class ToolService {
  private static instance: ToolService;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): ToolService {
    if (!ToolService.instance) {
      ToolService.instance = new ToolService();
    }
    return ToolService.instance;
  }

  private cleanToolData(data: any): any {
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          acc[key] = value.map(item => {
            if (item && typeof item === 'object') {
              return this.cleanToolData(item);
            }
            return item;
          }).filter(Boolean);
        } else if (value && typeof value === 'object') {
          acc[key] = this.cleanToolData(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as any);

    return cleanedData;
  }

  private validateToolData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Tool name is required and must be a string');
    }

    if (!data.description || typeof data.description !== 'string') {
      throw new Error('Tool description is required and must be a string');
    }

    if (!data.category || ![PLAN.FREE, PLAN.PLUS, PLAN.ENTERPRISE].includes(data.category)) {
      throw new Error('Invalid tool category');
    }

    if (!data.toolCategory || typeof data.toolCategory !== 'string') {
      throw new Error('Tool category is required and must be a string');
    }

    if (!data.icon || typeof data.icon !== 'string') {
      throw new Error('Tool icon is required and must be a string');
    }

    if (!Array.isArray(data.fields) || data.fields.length === 0) {
      throw new Error('Tool must have at least one field');
    }

    data.fields.forEach((field: any, index: number) => {
      if (!field.label || typeof field.label !== 'string') {
        throw new Error(`Field ${index + 1} must have a label`);
      }
      if (!field.placeholder || typeof field.placeholder !== 'string') {
        throw new Error(`Field ${index + 1} must have a placeholder`);
      }
      if (!field.type || !['input', 'textarea', 'select'].includes(field.type)) {
        throw new Error(`Field ${index + 1} has an invalid type`);
      }
      // Only validate options for non-subject select fields
      if (field.type === 'select' && !field.isSubjectField && (!Array.isArray(field.options) || field.options.length === 0)) {
        throw new Error(`Field ${index + 1} (select) must have options`);
      }
    });
  }

  private getToolNavigation(tool: Partial<Tool>): string {
    return tool.navigation || tool.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
  }

  async getAllTools(): Promise<Tool[]> {
    try {
      const toolsRef = collection(this.db, 'tools');
      const snapshot = await getDocs(toolsRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          navigation: this.getToolNavigation(data)
        } as Tool;
      });
    } catch (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }
  }

  async getToolById(id: string): Promise<Tool | null> {
    try {
      const toolRef = doc(this.db, 'tools', id);
      const snapshot = await getDoc(toolRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id,
        navigation: this.getToolNavigation(data)
      } as Tool;
    } catch (error) {
      console.error('Error fetching tool:', error);
      throw error;
    }
  }

  async createTool(tool: Omit<Tool, 'id'>): Promise<string> {
    try {
      const cleanedData = this.cleanToolData(tool);
      this.validateToolData(cleanedData);

      const toolsRef = collection(this.db, 'tools');
      const newToolRef = doc(toolsRef);

      const navigation = this.getToolNavigation({
        ...cleanedData,
        id: newToolRef.id
      });

      const toolData = {
        ...cleanedData,
        id: newToolRef.id,
        navigation,
        isEnterprise: cleanedData.category === PLAN.ENTERPRISE
      };

      await setDoc(newToolRef, toolData);
      return newToolRef.id;
    } catch (error) {
      console.error('Error creating tool:', error);
      throw error;
    }
  }

  async updateTool(id: string, updates: Partial<Tool>): Promise<void> {
    try {
      const currentTool = await this.getToolById(id);
      if (!currentTool) {
        throw new Error('Tool not found');
      }

      const mergedData = {
        ...currentTool,
        ...updates,
        id,
        navigation: this.getToolNavigation({ ...currentTool, ...updates })
      };

      const cleanedData = this.cleanToolData(mergedData);
      this.validateToolData(cleanedData);

      const toolRef = doc(this.db, 'tools', id);
      await updateDoc(toolRef, cleanedData);
    } catch (error) {
      console.error('Error updating tool:', error);
      throw error;
    }
  }

  async deleteTool(id: string): Promise<void> {
    try {
      const toolRef = doc(this.db, 'tools', id);
      await deleteDoc(toolRef);
    } catch (error) {
      console.error('Error deleting tool:', error);
      throw error;
    }
  }

  async getToolsBySchool(schoolId: string): Promise<Tool[]> {
    try {
      const toolsRef = collection(this.db, 'tools');
      const q = query(toolsRef, where('schoolId', '==', schoolId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          navigation: this.getToolNavigation(data)
        } as Tool;
      });
    } catch (error) {
      console.error('Error fetching school tools:', error);
      throw error;
    }
  }
}