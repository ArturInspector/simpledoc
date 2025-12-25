# Как запустить фронтенд

## ⚠️ Важно: Установите зависимости!

Если вы на Linux и получаете ошибки при сборке Tauri, сначала установите системные зависимости:

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libjavascriptcoregtk-4.1-dev libsoup-3.0-dev libgtk-4-dev
```

**См. `INSTALL_DEPS.md` для подробных инструкций.**

## Быстрый старт

### 1. Установите зависимости (если еще не установлены)

```bash
cd simpledoc
npm install
```

### 2. Запустите приложение

**Вариант A: Полное приложение (с Tauri окном)**
```bash
npm run tauri dev
```

**Вариант B: Только фронтенд (без Tauri)**
```bash
npm run dev
```
Откроется на `http://localhost:1420`

## Команды

- `npm run dev` - запустить только фронтенд (Vite dev server)
- `npm run tauri dev` - запустить с Tauri окном (полное десктопное приложение)
- `npm run build` - собрать фронтенд для production
- `npm run tauri build` - собрать десктопное приложение

## Структура проекта

```
simpledoc/
├── src/
│   ├── lib/
│   │   ├── components/     # Все компоненты
│   │   │   ├── ui/         # UI компоненты (Button, Input, etc.)
│   │   │   ├── layout/     # Layout компоненты (AppLayout, Ribbon, etc.)
│   │   │   └── features/   # Feature компоненты (DocumentEditor)
│   │   ├── stores/         # State management (Svelte stores)
│   │   ├── types/          # TypeScript типы
│   │   ├── utils/          # Утилиты
│   │   └── constants/      # Константы (ribbon config)
│   └── routes/             # SvelteKit routes
├── src-tauri/              # Rust backend (Tauri)
└── python/                 # Python модули для генерации документов
```

## Что работает сейчас

✅ Базовая структура с Ribbon (как в MS Office)
✅ Header с кнопками управления окном
✅ Sidebar с документами
✅ Редактор документов
✅ Компоненты UI (Button, Input, Card, etc.)
✅ State management через Svelte stores
✅ Тема в стиле Microsoft Office
✅ TailwindCSS с кастомной темой Office

## Следующие шаги

1. **Интеграция с Python**: Подключить генерацию документов через Rust команды
2. **Добавить больше шаблонов**: Расширить библиотеку шаблонов
3. **Управление клиентами**: CRUD для клиентов
4. **История генераций**: Сохранение сгенерированных документов
5. **Настройки**: UI для настроек приложения

## Отладка

Если есть ошибки:

1. Проверьте, что все зависимости установлены: `npm install`
2. Очистите кэш: `rm -rf node_modules/.vite`
3. Проверьте TypeScript ошибки: `npm run check`
4. Если проблемы с Tauri - см. `INSTALL_DEPS.md`

## Полезные ссылки

- [Svelte 5 Docs](https://svelte.dev/docs)
- [Tauri Docs](https://tauri.app/)
- [TailwindCSS Docs](https://tailwindcss.com/)
