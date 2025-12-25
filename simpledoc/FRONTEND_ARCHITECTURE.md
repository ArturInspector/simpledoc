# SimpleDoc Frontend Architecture

## 🎨 Обзор архитектуры

Фронтенд SimpleDoc построен на **Svelte 5** с использованием **runes** ($state, $derived, $effect) и следует принципам **модульной, масштабируемой архитектуры** для блочного редактора.

## 📁 Структура проекта

```
src/
├── lib/
│   ├── components/
│   │   ├── blocks/           # Компоненты блоков
│   │   │   ├── TextBlock.svelte
│   │   │   ├── ImageBlock.svelte
│   │   │   ├── TableBlock.svelte
│   │   │   └── SpacerBlock.svelte
│   │   ├── canvas/           # Canvas система
│   │   │   ├── Canvas.svelte          # Главный холст
│   │   │   ├── Grid.svelte            # Сетка
│   │   │   ├── BlockRenderer.svelte   # Рендерер блоков
│   │   │   └── SelectionBox.svelte    # Выделение
│   │   ├── editor/           # Главный редактор
│   │   │   ├── EditorLayout.svelte
│   │   │   └── Toolbar.svelte
│   │   └── panels/           # Боковые панели
│   │       ├── BlockLibrary.svelte    # Библиотека блоков
│   │       └── PropertiesPanel.svelte # Свойства блока
│   ├── stores/               # Svelte stores (state management)
│   │   ├── canvas.ts         # Canvas state
│   │   ├── blocks.ts         # Блоки и их операции
│   │   ├── document.ts       # Документ и страницы
│   │   ├── ui.ts             # UI состояние
│   │   └── index.ts          # Централизованный export
│   ├── types/                # TypeScript типы
│   │   ├── blocks.ts         # Типы блоков
│   │   ├── canvas.ts         # Типы холста
│   │   ├── document.ts       # Типы документа
│   │   └── index.ts          # Главный export
│   └── utils/                # Утилиты
│       ├── blockFactory.ts   # Создание блоков
│       └── geometry.ts       # Геометрические вычисления
└── routes/
    ├── +page.svelte          # Главная страница (Editor)
    └── +layout.svelte        # Root layout
```

## 🏗️ Архитектурные принципы

### 1. **Separation of Concerns**
- **Types** - чистые TypeScript интерфейсы (никакой логики)
- **Stores** - state management и бизнес-логика
- **Components** - только отображение и UI взаимодействия
- **Utils** - чистые функции без side effects

### 2. **Unidirectional Data Flow**
```
User Action → Store Action → State Update → Component Re-render
```

### 3. **Composition Over Inheritance**
- Блоки компонуются из базовых элементов
- Используем Svelte slots и props для гибкости
- Никаких глубоких иерархий компонентов

## 🗄️ State Management (Stores)

### Canvas Store
Управляет холстом, zoom, viewport, сеткой:

```typescript
import { canvasStore } from '$lib/stores';

// Zoom
canvasStore.zoomIn();
canvasStore.zoomOut();
canvasStore.zoomToFit(width, height);

// Grid
canvasStore.toggleGrid();
canvasStore.setGridSize(8);

// Viewport
canvasStore.panViewport(deltaX, deltaY);
canvasStore.centerViewport();
```

### Blocks Store
Управляет блоками на странице:

```typescript
import { blocksActions, blocks } from '$lib/stores';

// CRUD операции
blocksActions.add(block);
blocksActions.remove(blockId);
blocksActions.update(blockId, updates);
blocksActions.move(blockId, position);
blocksActions.resize(blockId, size);

// Z-index
blocksActions.bringForward(blockId);
blocksActions.sendBackward(blockId);
blocksActions.bringToFront(blockId);
blocksActions.sendToBack(blockId);

// Утилиты
blocksActions.duplicate(blockId);
blocksActions.toggleLock(blockId);
```

### Selection Store
Управляет выделением блоков:

```typescript
import { selectionActions, selectedBlocks } from '$lib/stores';

// Выделение
selectionActions.select(blockId);          // Выбрать один
selectionActions.add(blockId);             // Добавить к выделению
selectionActions.selectMany([id1, id2]);   // Выбрать несколько
selectionActions.selectAll();              // Выбрать все
selectionActions.clear();                  // Снять выделение
```

### Document Store
Управляет документом и страницами:

```typescript
import { documentActions, pageActions } from '$lib/stores';

// Документ
documentActions.create('New Document');
documentActions.save();
documentActions.load(document);
documentActions.close();

// Страницы
pageActions.add();
pageActions.remove(pageId);
pageActions.switchTo(pageIndex);
pageActions.duplicate(pageId);
```

## 🎨 Создание блоков

### Block Factory
Утилита для создания блоков:

```typescript
import { createTextBlock, createImageBlock, createTableBlock } from '$lib/utils/blockFactory';

// Текстовые блоки
const heading = createHeadingBlock('Title', 1);
const paragraph = createParagraphBlock('Text');

// Изображение
const image = createImageBlock('/path/to/image.png');

// Таблица
const table = createTableBlock(3, 4); // 3 rows, 4 cols

// Spacer
const spacer = createSpacerBlock(50); // 50px height
```

## 🎯 Типы данных

### Block
```typescript
interface Block {
  id: string;
  type: 'text' | 'image' | 'table' | 'spacer';
  position: { x: number; y: number };
  size: { width: number; height: number };
  transform: { rotation: number; scaleX: number; scaleY: number };
  zIndex: number;
  locked: boolean;
  visible: boolean;
  content: BlockContent;
  styles: BlockStyles;
  metadata: { createdAt: Date; updatedAt: Date; version: number };
}
```

### Canvas Config
```typescript
interface CanvasConfig {
  zoom: number;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  viewportOffset: { x: number; y: number };
}
```

## 🖱️ Взаимодействия

### Клавиатурные shortcuts
- **Ctrl+N** - New Document
- **Ctrl+S** - Save Document
- **Ctrl+E** - Export Document
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Ctrl+C** - Copy
- **Ctrl+V** - Paste
- **Ctrl+D** - Duplicate
- **Ctrl+A** - Select All
- **Delete** - Delete Block
- **Escape** - Deselect
- **Ctrl+0** - Reset Zoom
- **Ctrl+=** - Zoom In
- **Ctrl+-** - Zoom Out
- **Ctrl+G** - Toggle Grid
- **Ctrl+R** - Toggle Rulers
- **Ctrl+B** - Toggle Block Panel
- **Ctrl+P** - Toggle Properties Panel

### Мышь
- **Click** - Select block
- **Double-click** - Edit block (inline)
- **Drag** - Move block
- **Drag handles** - Resize block
- **Ctrl+Click** - Multi-select
- **Middle mouse/Space+drag** - Pan canvas
- **Ctrl+Wheel** - Zoom

## 🎨 Design Tokens

Следуем **FORDESIGNER.md**:

### Colors
- **Primary**: #0284c7 (blue-600)
- **Background**: #f8fafc (gray-50)
- **Canvas**: #f1f5f9 (gray-100)
- **Page**: #ffffff
- **Grid**: #e2e8f0 (gray-300)
- **Selection**: #3b82f6 (blue-500)

### Typography
- **Font**: Inter
- **Base**: 14px (text-sm)
- **Headings**: 16-24px, semibold

### Spacing
- **Grid**: 8px
- **Padding**: 16px (spacing-4)
- **Gaps**: 8px, 12px, 16px

### Border Radius
- **Buttons/Inputs**: 6px
- **Cards**: 8px
- **Panels**: 0px (sharp edges)

## 🚀 Расширение

### Добавление нового типа блока

1. **Создать тип в `types/blocks.ts`**:
```typescript
export interface MyBlockContent {
  // ... fields
}
```

2. **Добавить фабрику в `utils/blockFactory.ts`**:
```typescript
export function createMyBlock(): Block {
  // ... implementation
}
```

3. **Создать компонент `components/blocks/MyBlock.svelte`**:
```svelte
<script lang="ts">
  export let block: Block;
  $: content = block.content as MyBlockContent;
</script>

<div class="my-block">
  <!-- render content -->
</div>
```

4. **Добавить в `BlockRenderer.svelte`**:
```svelte
{:else if block.type === 'my-type'}
  <MyBlock {block} />
```

## 📦 Dependencies

- **svelte** - Frontend framework
- **tailwindcss** - Utility-first CSS
- **@tauri-apps/api** - Tauri integration

## 🧪 Testing Strategy

- **Unit Tests**: Stores, utils
- **Component Tests**: Svelte Testing Library
- **E2E Tests**: Playwright (TODO)

## 📝 TODO

- [ ] Drag-and-drop из Block Library на Canvas
- [ ] Undo/Redo через Command pattern
- [ ] Множественное выделение (Selection Box)
- [ ] Направляющие (Guides)
- [ ] Линейки (Rulers)
- [ ] Группировка блоков
- [ ] Keyboard navigation между блоками
- [ ] Accessibility (ARIA labels, keyboard support)

---

**Готово к первой реализации! 🚀**

