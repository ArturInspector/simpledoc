import { writable, derived } from 'svelte/store';
import type { Template, TemplateCategory } from '$lib/types';
import { generateId } from '$lib/utils';

// Mock данные для демонстрации
const initialTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Коммерческое предложение',
    description: 'Шаблон для коммерческих предложений',
    category: 'commercial_offer',
    filePath: '',
    variables: [
      {
        key: 'company_name',
        label: 'Название компании',
        type: 'text',
        required: true,
      },
      {
        key: 'client_name',
        label: 'Имя клиента',
        type: 'text',
        required: true,
      },
      {
        key: 'date',
        label: 'Дата',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
      },
      {
        key: 'items',
        label: 'Товары/Услуги',
        type: 'textarea',
        required: false,
      },
      {
        key: 'total',
        label: 'Итого',
        type: 'number',
        required: true,
      },
    ],
    createdAt: new Date(),
  },
];

export const templates = writable<Template[]>(initialTemplates);

export const templatesByCategory = derived(templates, ($templates) => {
  const grouped: Record<TemplateCategory, Template[]> = {
    commercial_offer: [],
    invoice: [],
    contract: [],
    other: [],
  };
  
  $templates.forEach(template => {
    grouped[template.category].push(template);
  });
  
  return grouped;
});

export function addTemplate(template: Omit<Template, 'id' | 'createdAt'>) {
  templates.update(list => [
    ...list,
    {
      ...template,
      id: generateId(),
      createdAt: new Date(),
    },
  ]);
}

export function updateTemplate(id: string, updates: Partial<Template>) {
  templates.update(list =>
    list.map(t => (t.id === id ? { ...t, ...updates } : t))
  );
}

export function deleteTemplate(id: string) {
  templates.update(list => list.filter(t => t.id !== id));
}

