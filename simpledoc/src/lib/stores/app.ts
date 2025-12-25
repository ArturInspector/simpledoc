import { writable } from 'svelte/store';
import type { AppSettings, Document, Template, Client } from '$lib/types';

// Настройки приложения
export const settings = writable<AppSettings>({
  theme: 'light',
  defaultSavePath: '',
  language: 'ru',
  autoSave: false,
});

// Документы
export const documents = writable<Document[]>([]);
export const currentDocument = writable<Document | null>(null);

// Шаблоны (импортируем из отдельного файла для лучшей организации)
import { templates } from './templates';
export { templates };
export const currentTemplate = writable<Template | null>(null);

// Клиенты
export const clients = writable<Client[]>([]);
export const currentClient = writable<Client | null>(null);

// UI State
export const isRibbonCollapsed = writable<boolean>(false);
export const activeRibbonTab = writable<string>('home');
export const sidebarOpen = writable<boolean>(true);
export const isLoading = writable<boolean>(false);
export const notification = writable<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

