# Архитектура проекта: DesktopApp для генерации документов

## Концепция
Кроссплатформенное десктопное приложение для создания и генерации документов и коммерческих предложений.

## Технологический стек

### Frontend
- **Framework**: React или Svelte (на выбор)
- **Styling**: TailwindCSS или аналогичный
- **State Management**: Zustand (для React) или Svelte stores

### Backend (Rust)
- **Framework**: Tauri 2.x (кроссплатформенный десктопный фреймворк)
- **Language**: Rust
- **Responsibilities**:
  - Управление файловой системой
  - IPC (Inter-Process Communication) между Frontend и Backend
  - Интеграция с Python-скриптами
  - Обработка данных документов

### Document Generation (Python)
- **Libraries**:
  - `python-docx` - работа с .docx файлами
  - `reportlab` или `weasyprint` - генерация PDF
  - `jinja2` - шаблонизация
  - `openpyxl` - работа с Excel (если нужно)
  - `pillow` - обработка изображений

### Интеграция Rust-Python
- **Option 1**: PyO3 (напрямую встроить Python в Rust)
- **Option 2**: Subprocess (запускать Python скрипты через командную строку)
- **Option 3**: Python HTTP сервер (локальный Flask/FastAPI сервер)

## Структура проекта

```
desktopapp/
├── src-tauri/              # Rust backend (Tauri)
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   ├── commands.rs     # Tauri commands (API для фронтенда)
│   │   ├── python.rs       # Интеграция с Python
│   │   └── models.rs       # Модели данных
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                    # Frontend (React/Svelte)
│   ├── components/
│   ├── pages/
│   ├── stores/
│   └── main.tsx / App.svelte
│
├── python/                 # Python модули для генерации документов
│   ├── document_generator/
│   │   ├── __init__.py
│   │   ├── docx_generator.py
│   │   ├── pdf_generator.py
│   │   └── templates/
│   └── requirements.txt
│
├── templates/              # Шаблоны документов
│   ├── commercial_offer/
│   └── documents/
│
└── package.json
```

## Потоки данных

### 1. Создание документа
```
Frontend (React/Svelte)
    ↓ (Tauri command)
Rust Backend (Tauri)
    ↓ (PyO3 / Subprocess)
Python Generator
    ↓
Генерация файла (.docx / .pdf)
    ↓
Возврат пути к файлу
    ↓
Frontend отображает результат
```

### 2. Редактирование шаблона
```
Frontend
    ↓
Tauri FS API
    ↓
Сохранение/загрузка шаблонов
```

## Основные функции

1. **Управление шаблонами**
   - Создание/редактирование шаблонов документов
   - Предпросмотр шаблонов
   - Импорт/экспорт шаблонов

2. **Генерация документов**
   - Заполнение данных в форму
   - Генерация .docx / .pdf
   - Предпросмотр сгенерированного документа
   - Экспорт в различные форматы

3. **Управление данными**
   - Сохранение контактов/клиентов
   - История генераций
   - Настройки приложения

## Преимущества Tauri

- ✅ Кроссплатформенность (Linux, Windows, macOS)
- ✅ Малый размер бандла (по сравнению с Electron)
- ✅ Безопасность (изолированный контекст)
- ✅ Поддержка React, Svelte, Vue и других фреймворков
- ✅ Rust производительность
- ✅ Нативный доступ к системным API

## Рекомендации по выбору Frontend

### React
- ✅ Больше готовых компонентов
- ✅ Больше примеров для Tauri
- ❌ Больше bundle size

### Svelte
- ✅ Меньше bundle size
- ✅ Более быстрая производительность
- ✅ Проще в изучении
- ❌ Меньше готовых компонентов (но достаточно)

**Рекомендация**: Svelte для более легковесного приложения, React если нужны специфичные библиотеки.

