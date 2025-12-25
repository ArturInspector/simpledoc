# Если стили не применяются

## Решение 1: Перезапуск dev server

1. Остановите текущий `npm run dev` (Ctrl+C)
2. Очистите кэш Vite:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Запустите снова:
   ```bash
   npm run dev
   ```

## Решение 2: Проверка импорта CSS

Убедитесь, что в `src/routes/+layout.svelte` есть:
```svelte
<script lang="ts">
  import '../styles/app.css';
  // ...
</script>
```

## Решение 3: Проверка TailwindCSS

Убедитесь, что TailwindCSS установлен:
```bash
npm list tailwindcss
```

Если нет, установите:
```bash
npm install -D tailwindcss@^3.4.0
```

## Решение 4: Проверка конфигурации

Убедитесь, что `tailwind.config.js` содержит правильный `content`:
```js
content: ['./src/**/*.{html,js,svelte,ts}'],
```

## Решение 5: Hard refresh в браузере

В dev tools браузера сделайте:
- Ctrl+Shift+R (Linux/Windows)
- Cmd+Shift+R (Mac)

Или откройте в инкогнито режиме.



