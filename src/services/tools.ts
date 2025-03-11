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
import {PLAN} from "../utils/constants.ts";

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
    // Remove undefined and null values
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Clean array items
          acc[key] = value.map(item => {
            if (item && typeof item === 'object') {
              return this.cleanToolData(item);
            }
            return item;
          }).filter(Boolean);
        } else if (value && typeof value === 'object') {
          // Clean nested objects
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
      if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
        throw new Error(`Field ${index + 1} (select) must have options`);
      }
    });
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
          navigation: data.navigation || doc.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
        navigation: data.navigation || snapshot.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      } as Tool;
    } catch (error) {
      console.error('Error fetching tool:', error);
      throw error;
    }
  }

  async createTool(tool: Omit<Tool, 'id'>): Promise<string> {
    try {
      // Clean and validate the data
      const cleanedData = this.cleanToolData(tool);
      this.validateToolData(cleanedData);

      // Create a new document with auto-generated ID
      const toolsRef = collection(this.db, 'tools');
      const newToolRef = doc(toolsRef);

      // Generate navigation if not provided
      const navigation = cleanedData.navigation || 
        cleanedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Add the document with the ID and navigation included in the data
      await setDoc(newToolRef, {
        ...cleanedData,
        id: newToolRef.id,
        navigation
      });

      return newToolRef.id;
    } catch (error) {
      console.error('Error creating tool:', error);
      throw error;
    }
  }

  async updateTool(id: string, updates: Partial<Tool>): Promise<void> {
    try {
      // Get current tool data
      const currentTool = await this.getToolById(id);
      if (!currentTool) {
        throw new Error('Tool not found');
      }

      // Merge updates with current data
      const mergedData = {
        ...currentTool,
        ...updates,
        id, // Ensure ID is preserved
        navigation: updates.navigation || currentTool.navigation // Preserve or update navigation
      };

      // Clean and validate the merged data
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
}