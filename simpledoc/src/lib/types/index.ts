// Common types для приложения

export interface Document {
  id: string;
  title: string;
  templateId?: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  path?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  filePath: string;
  preview?: string;
  variables: TemplateVariable[];
  createdAt: Date;
}

export type TemplateCategory = 'commercial_offer' | 'invoice' | 'contract' | 'other';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'list';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // Для type: 'list'
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
}

export interface DocumentGenerationResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultSavePath: string;
  language: string;
  autoSave: boolean;
}

