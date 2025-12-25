// Константы для Ribbon UI в стиле MS Office

export const RIBBON_TABS = {
  HOME: 'home',
  INSERT: 'insert',
  DESIGN: 'design',
  DOCUMENTS: 'documents',
  TEMPLATES: 'templates',
  SETTINGS: 'settings',
} as const;

export type RibbonTab = typeof RIBBON_TABS[keyof typeof RIBBON_TABS];

export interface RibbonTabConfig {
  id: RibbonTab;
  label: string;
  icon?: string;
  groups: RibbonGroup[];
}

export interface RibbonGroup {
  id: string;
  label: string;
  items: RibbonItem[];
}

export interface RibbonItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
  large?: boolean; // Для больших кнопок
}

export const ribbonConfig: RibbonTabConfig[] = [
  {
    id: RIBBON_TABS.HOME,
    label: 'Главная',
    groups: [
      {
        id: 'new',
        label: 'Создать',
        items: [
          {
            id: 'new-document',
            label: 'Новый документ',
            icon: '📄',
            shortcut: 'Ctrl+N',
            action: async () => {
              // Будет реализовано
            },
            large: true,
          },
          {
            id: 'new-from-template',
            label: 'Из шаблона',
            icon: '📋',
            action: async () => {},
          },
        ],
      },
      {
        id: 'save',
        label: 'Сохранить',
        items: [
          {
            id: 'save',
            label: 'Сохранить',
            icon: '💾',
            shortcut: 'Ctrl+S',
            action: async () => {},
          },
          {
            id: 'save-as',
            label: 'Сохранить как',
            icon: '📁',
            shortcut: 'Ctrl+Shift+S',
            action: async () => {},
          },
        ],
      },
    ],
  },
  {
    id: RIBBON_TABS.DOCUMENTS,
    label: 'Документы',
    groups: [
      {
        id: 'generate',
        label: 'Генерация',
        items: [
          {
            id: 'generate-docx',
            label: 'Генерировать DOCX',
            icon: '📝',
            action: async () => {},
          },
          {
            id: 'generate-pdf',
            label: 'Генерировать PDF',
            icon: '📄',
            action: async () => {},
          },
        ],
      },
    ],
  },
  {
    id: RIBBON_TABS.TEMPLATES,
    label: 'Шаблоны',
    groups: [
      {
        id: 'manage',
        label: 'Управление',
        items: [
          {
            id: 'manage-templates',
            label: 'Управление шаблонами',
            icon: '📚',
            action: async () => {},
          },
          {
            id: 'edit-template',
            label: 'Редактировать',
            icon: '✏️',
            action: async () => {},
          },
        ],
      },
    ],
  },
  {
    id: RIBBON_TABS.SETTINGS,
    label: 'Настройки',
    groups: [
      {
        id: 'preferences',
        label: 'Предпочтения',
        items: [
          {
            id: 'settings',
            label: 'Настройки',
            icon: '⚙️',
            action: async () => {},
          },
        ],
      },
    ],
  },
];

