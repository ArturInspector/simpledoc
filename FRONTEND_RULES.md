# Frontend Development Rules (Svelte)

## Design System Compliance

**Always follow FORDESIGNER.md specifications:**
- Use exact color values (blue-600: #0284c7, gray-50: #f8fafc, etc.)
- Apply spacing system (multiples of 4px: spacing-4 = 16px)
- Use border-radius: 6px for buttons/inputs, 8px for cards
- Follow typography scale (text-sm: 14px, text-base: 16px)
- Use shadow-sm for buttons, shadow-md for cards, shadow-lg for dropdowns

## Component Structure

**Component organization:**
- Place UI components in `src/lib/components/ui/`
- Place layout components in `src/lib/components/layout/`
- Place feature components in `src/lib/components/features/`
- Use PascalCase for component names (Button.svelte, DocumentEditor.svelte)

**Component patterns:**
- Use Svelte 5 runes ($state, $derived, $effect)
- Export props with TypeScript interfaces
- Keep components focused and composable
- Use slots for flexible content areas

## Styling Guidelines

**Tailwind CSS usage:**
- Use utility classes, avoid custom CSS when possible
- Follow design tokens from FORDESIGNER.md
- Use semantic color names (blue-600, gray-700, not hex codes)
- Apply hover states with transition-all duration-150
- Use focus:ring-2 focus:ring-blue-500 for keyboard navigation

**Accessibility:**
- All interactive elements need aria-label or aria-labelledby
- Use focus-visible for keyboard focus indicators
- Maintain WCAG AAA contrast ratios (7:1 for text)
- Provide loading states with aria-busy

## State Management

**Svelte stores:**
- Use writable/readable stores in `src/lib/stores/`
- Keep stores focused on specific domains (app.ts, templates.ts)
- Use $state for local component state
- Use $derived for computed values

## Animation & Motion

**Follow FORDESIGNER.md timing:**
- Hover: 150ms, ease-default
- Button press: 100ms, scale(0.98)
- Modal open: 300ms, ease-decelerate
- Use transition directives for smooth animations

## Component Library

**Use shadcn-svelte components:**
- Install via npx shadcn-svelte@latest init
- Customize to match FORDESIGNER.md colors and spacing
- Prefer shadcn components over custom implementations

## Code Quality

**Best practices:**
- Keep components under 200 lines when possible
- Extract complex logic to utility functions
- Use TypeScript for all props and state
- Handle loading and error states explicitly
- Provide clear user feedback for all actions

