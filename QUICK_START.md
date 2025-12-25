# Быстрый старт проекта

## Шаг 1: Инициализация Tauri проекта

### Вариант A: С React

```bash
# Убедитесь, что Node.js установлен
node --version  # должен быть 18+

# Создайте Tauri проект
npm create tauri-app@latest

# Выберите:
# - Project name: desktopapp
# - Package manager: npm/pnpm/yarn (на ваш выбор)
# - UI framework: react-ts
# - UI flavor: typescript

cd desktopapp
```

### Вариант B: С Svelte

```bash
npm create tauri-app@latest

# Выберите:
# - Project name: desktopapp
# - UI framework: svelte-ts
# - UI flavor: typescript

cd desktopapp
```

## Шаг 2: Настройка Python окружения

```bash
# Создайте директорию для Python модулей
mkdir -p python/document_generator/templates

# Создайте виртуальное окружение
cd python
python3 -m venv venv

# Активируйте окружение
# На Linux/macOS:
source venv/bin/activate
# На Windows:
# venv\Scripts\activate

# Установите зависимости
pip install python-docx reportlab jinja2 pillow openpyxl
pip freeze > requirements.txt

cd ..
```

## Шаг 3: Базовая структура Python модуля

Создайте файл `python/document_generator/__init__.py`:

```python
"""Модуль для генерации документов"""
```

Создайте файл `python/document_generator/docx_generator.py`:

```python
from docx import Document
from docx.shared import Inches
import os

def generate_docx(template_path: str, output_path: str, data: dict) -> str:
    """
    Генерирует DOCX документ из шаблона с подстановкой данных
    
    Args:
        template_path: Путь к шаблону .docx
        output_path: Путь для сохранения результата
        data: Словарь с данными для подстановки
        
    Returns:
        Путь к сгенерированному файлу
    """
    doc = Document(template_path)
    
    # Простая замена текста (можно улучшить через jinja2)
    for paragraph in doc.paragraphs:
        for key, value in data.items():
            if key in paragraph.text:
                paragraph.text = paragraph.text.replace(f"{{{{{key}}}}}", str(value))
    
    doc.save(output_path)
    return output_path
```

## Шаг 4: Настройка Rust backend (Tauri)

После инициализации Tauri, структура будет такой:

```
desktopapp/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   └── ...
│   └── Cargo.toml
├── src/  # Frontend код
└── package.json
```

### Добавьте команды в Tauri

Создайте `src-tauri/src/commands.rs`:

```rust
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct DocumentData {
    pub title: String,
    pub content: String,
    pub client_name: String,
}

#[tauri::command]
pub async fn generate_document(
    data: DocumentData,
    output_path: String,
) -> Result<String, String> {
    // Вызов Python скрипта через subprocess
    let output = Command::new("python3")
        .arg("-c")
        .arg(format!(
            "from document_generator.docx_generator import generate_docx; \
             import json, sys; \
             data = json.loads('{}'); \
             generate_docx('template.docx', '{}', data)",
            serde_json::to_string(&data).unwrap(),
            output_path
        ))
        .output()
        .map_err(|e| format!("Failed to execute Python: {}", e))?;

    if output.status.success() {
        Ok(output_path)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
```

Обновите `src-tauri/src/main.rs`:

```rust
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::generate_document;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_document])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Шаг 5: Тестирование

```bash
# Запустите в режиме разработки
npm run tauri dev
```

## Следующие шаги

1. Настройте правильные пути к Python окружению
2. Реализуйте более продвинутую систему шаблонов
3. Добавьте UI компоненты для ввода данных
4. Реализуйте предпросмотр документов
5. Добавьте управление шаблонами

См. [PROJECT_PLAN.md](./PROJECT_PLAN.md) для детального плана разработки.

