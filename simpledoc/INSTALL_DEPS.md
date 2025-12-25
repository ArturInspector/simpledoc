# Установка системных зависимостей для Tauri на Linux

## Проблема

При запуске `npm run tauri dev` возникает ошибка:
- `libsoup-3.0` не найден
- `javascriptcoregtk-4.1` не найден

## Решение

Установите системные зависимости для Tauri:

### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libjavascriptcoregtk-4.1-dev \
  libsoup-3.0-dev \
  libgtk-4-dev
```

### Arch Linux:

```bash
sudo pacman -S webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  libxdo \
  openssl \
  libappindicator \
  librsvg \
  libjavascriptcoregtk-4.1 \
  libsoup-3.0 \
  gtk4
```

### Fedora:

```bash
sudo dnf install webkit2gtk4.1-devel.x86_64 \
  openssl-devel \
  curl \
  wget \
  libX11-devel \
  libappindicator \
  librsvg2-devel \
  libjavascriptcoregtk-4.1 \
  libsoup-3.0-devel \
  gtk4-devel
```

## После установки

Попробуйте снова запустить:

```bash
cd simpledoc
npm run tauri dev
```

## Альтернатива: запуск только фронтенда

Если не хотите устанавливать зависимости Tauri прямо сейчас, можете запустить только фронтенд:

```bash
npm run dev
```

Это запустит Vite dev server на `http://localhost:1420` (порт из vite.config.js).

## Проверка установленных зависимостей

Проверить, установлены ли нужные библиотеки:

```bash
pkg-config --exists libsoup-3.0 && echo "libsoup-3.0: OK" || echo "libsoup-3.0: NOT FOUND"
pkg-config --exists javascriptcoregtk-4.1 && echo "javascriptcoregtk-4.1: OK" || echo "javascriptcoregtk-4.1: NOT FOUND"
```

## Дополнительная информация

Если у вас проблемы с установкой, смотрите официальную документацию:
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

