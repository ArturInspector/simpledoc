# Design System: SimpleDoc Enterprise

Professional-grade design system for visual document editor. Inspired by Apple HIG, Linear, Vercel, and Next.js design principles.

## Design Philosophy

**Enterprise First**
- Clean, professional aesthetics
- High contrast for accessibility
- Data-dense interfaces done right
- Performance-oriented animations

**Visual Hierarchy**
- Clear information architecture
- Purposeful use of color
- Strategic whitespace
- Consistent sizing and spacing

**Trust and Clarity**
- No ambiguous states
- Clear feedback for every action
- Professional typography
- Precise alignment

## Color System

### Primary Palette

**Blue Scale** (Primary Brand)
```
blue-50:  #f0f9ff  // Backgrounds, subtle highlights
blue-100: #e0f2fe  // Hover states, light backgrounds
blue-200: #bae6fd  // Borders, dividers
blue-300: #7dd3fc  // Disabled states
blue-400: #38bdf8  // Secondary actions
blue-500: #0ea5e9  // Primary actions, links
blue-600: #0284c7  // Primary hover
blue-700: #0369a1  // Active states
blue-800: #075985  // Text on light backgrounds
blue-900: #0c4a6e  // Headers, strong emphasis
blue-950: #082f49  // Maximum contrast
```

**Neutral Scale** (Grayscale)
```
gray-50:  #f8fafc  // Page background
gray-100: #f1f5f9  // Card background
gray-200: #e2e8f0  // Borders
gray-300: #cbd5e1  // Disabled text
gray-400: #94a3b8  // Placeholders
gray-500: #64748b  // Secondary text
gray-600: #475569  // Body text
gray-700: #334155  // Headings
gray-800: #1e293b  // Strong headings
gray-900: #0f172a  // Maximum contrast text
gray-950: #020617  // Absolute black (rare use)
```

### Semantic Colors

**Success**
```
green-50:  #f0fdf4
green-500: #22c55e  // Success states
green-600: #16a34a  // Success hover
green-700: #15803d  // Success active
```

**Warning**
```
amber-50:  #fffbeb
amber-500: #f59e0b  // Warning states
amber-600: #d97706  // Warning hover
amber-700: #b45309  // Warning active
```

**Error**
```
red-50:  #fef2f2
red-500: #ef4444  // Error states
red-600: #dc2626  // Error hover
red-700: #b91c1c  // Error active
```

**Info**
```
sky-50:  #f0f9ff
sky-500: #0ea5e9  // Info states (same as primary)
sky-600: #0284c7
sky-700: #0369a1
```

### Surface Colors

```
canvas:     gray-50   // Main canvas background
surface:    white     // Cards, panels, modals
surface-2:  gray-100  // Nested surfaces
elevated:   white     // Floating elements (dropdowns, tooltips)
overlay:    rgba(15, 23, 42, 0.5)  // Modal overlays
```

### Text Colors

```
primary:    gray-900  // Main text
secondary:  gray-600  // Supporting text
tertiary:   gray-500  // Subtle text
disabled:   gray-300  // Disabled text
inverse:    white     // Text on dark backgrounds
link:       blue-600  // Links
link-hover: blue-700  // Link hover
```

## Typography

### Font Families

**Sans-serif Stack** (UI Text)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

**Monospace Stack** (Code, Technical)
```css
font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 
             'Cascadia Code', 'Consolas', monospace;
```

**Serif Stack** (Document Content - Optional)
```css
font-family: 'Charter', 'Georgia', 'Times New Roman', serif;
```

### Font Sizes

```
text-xs:   0.75rem   (12px)  // Captions, labels
text-sm:   0.875rem  (14px)  // Secondary text
text-base: 1rem      (16px)  // Body text
text-lg:   1.125rem  (18px)  // Large body
text-xl:   1.25rem   (20px)  // H4
text-2xl:  1.5rem    (24px)  // H3
text-3xl:  1.875rem  (30px)  // H2
text-4xl:  2.25rem   (36px)  // H1
text-5xl:  3rem      (48px)  // Display
```

### Font Weights

```
light:    300  // Rarely used
normal:   400  // Body text
medium:   500  // Emphasized text, buttons
semibold: 600  // Headings, important UI
bold:     700  // Strong emphasis
```

### Line Heights

```
leading-tight:  1.25   // Headings
leading-snug:   1.375  // Tight text blocks
leading-normal: 1.5    // Body text
leading-relaxed: 1.625 // Comfortable reading
leading-loose:  2      // Spacious text
```

## Spacing System

**Base unit: 4px** (0.25rem)

```
spacing-0:   0px     // No space
spacing-1:   4px     // Minimum spacing
spacing-2:   8px     // Tight spacing
spacing-3:   12px    // Small spacing
spacing-4:   16px    // Default spacing
spacing-5:   20px    // Medium spacing
spacing-6:   24px    // Large spacing
spacing-8:   32px    // XL spacing
spacing-10:  40px    // 2XL spacing
spacing-12:  48px    // 3XL spacing
spacing-16:  64px    // 4XL spacing
spacing-20:  80px    // Section spacing
spacing-24:  96px    // Large section spacing
```

## Border Radius

```
rounded-none: 0px      // Square corners
rounded-sm:   2px      // Subtle rounding
rounded:      4px      // Default (buttons, inputs)
rounded-md:   6px      // Medium (cards)
rounded-lg:   8px      // Large (panels)
rounded-xl:   12px     // XL (modals, major surfaces)
rounded-2xl:  16px     // 2XL (special features)
rounded-full: 9999px   // Pills, avatars
```

## Shadows

```css
/* Subtle elevation */
shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Small elevation - Buttons, inputs */
shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1),
           0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Medium elevation - Cards */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
           0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Large elevation - Dropdowns, popovers */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
           0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Extra large - Modals */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),
           0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Maximum elevation - Major overlays */
shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## Component Specifications

### Buttons

**Primary Button**
```
Background: blue-600
Text: white
Padding: 12px 24px (spacing-3 spacing-6)
Border-radius: 6px (rounded-md)
Font-weight: 500 (medium)
Font-size: 14px (text-sm)
Shadow: shadow-sm
Hover: blue-700 + shadow-md
Active: blue-800
Disabled: gray-300 bg, gray-500 text
Transition: all 150ms ease
```

**Secondary Button**
```
Background: transparent
Text: gray-700
Border: 1px solid gray-300
Padding: 12px 24px
Border-radius: 6px
Font-weight: 500
Font-size: 14px
Hover: gray-100 bg
Active: gray-200 bg
```

**Ghost Button**
```
Background: transparent
Text: gray-600
Padding: 12px 24px
Border-radius: 6px
Font-weight: 500
Font-size: 14px
Hover: gray-100 bg
Active: gray-200 bg
```

**Icon Button**
```
Size: 36px × 36px
Border-radius: 6px
Padding: 8px
Icon-size: 20px
Hover: gray-100 bg
Active: gray-200 bg
```

### Inputs

**Text Input**
```
Height: 40px
Padding: 10px 12px
Border: 1px solid gray-300
Border-radius: 6px
Background: white
Font-size: 14px
Placeholder: gray-400
Focus: blue-500 ring (2px)
Error: red-500 border + ring
Disabled: gray-100 bg, gray-400 text
```

**Select/Dropdown**
```
Same as text input
Chevron icon: 16px, gray-500
Dropdown menu: shadow-lg
Max-height: 320px (scroll)
```

**Textarea**
```
Min-height: 80px
Max-height: 400px
Resize: vertical
Same styling as text input
```

### Cards

**Standard Card**
```
Background: white
Border: 1px solid gray-200
Border-radius: 8px
Padding: 24px
Shadow: shadow-sm
Hover: shadow-md (if interactive)
```

**Elevated Card**
```
Background: white
Border: none
Border-radius: 8px
Padding: 24px
Shadow: shadow-md
```

### Panels

**Side Panel** (Left/Right)
```
Width: 280px (collapsible)
Background: gray-50
Border: 1px solid gray-200
Padding: 16px
```

**Property Panel** (Right)
```
Width: 320px
Background: white
Border-left: 1px solid gray-200
Padding: 20px
```

**Toolbar** (Top)
```
Height: 56px
Background: white
Border-bottom: 1px solid gray-200
Padding: 0 16px
Shadow: shadow-sm
```

### Modals

**Standard Modal**
```
Max-width: 600px
Background: white
Border-radius: 12px
Padding: 32px
Shadow: shadow-2xl
Overlay: rgba(15, 23, 42, 0.5)
Backdrop-blur: 4px
```

**Large Modal**
```
Max-width: 900px
Max-height: 90vh
Scrollable content area
```

### Notifications/Toasts

**Toast**
```
Width: 400px
Background: white
Border: 1px solid gray-200
Border-radius: 8px
Padding: 16px
Shadow: shadow-lg
Position: top-right
Duration: 5s (auto-dismiss)
```

**Success Toast**
```
Border-left: 4px solid green-500
Icon: check-circle (green-500)
```

**Error Toast**
```
Border-left: 4px solid red-500
Icon: alert-circle (red-500)
```

**Warning Toast**
```
Border-left: 4px solid amber-500
Icon: alert-triangle (amber-500)
```

## Layout Specifications

### Application Structure

```
┌─────────────────────────────────────────────────────────┐
│ Header (56px)                                           │
│ [Logo] [Navigation] [Actions]           [User] [Settings]│
├─────────────────────────────────────────────────────────┤
│ Toolbar (56px)                                          │
│ [File] [Edit] [View] [Insert] [Format]    [Generate]   │
├──────┬──────────────────────────────────────────┬───────┤
│      │                                          │       │
│ Side │          Canvas Area                     │ Props │
│ Panel│          (Main Editor)                   │ Panel │
│ 280px│                                          │ 320px │
│      │                                          │       │
│ [Blocks]                                        │ [Styles]│
│ [Templates]                                     │ [Data]│
│ [Assets]                                        │       │
│      │                                          │       │
│      │                                          │       │
└──────┴──────────────────────────────────────────┴───────┘
```

### Canvas

**Background**
```
Color: gray-100
Grid: 8px dots, gray-300 color
Guides: blue-500, dashed
Rulers: optional, gray-700
```

**Block Selection**
```
Border: 2px solid blue-500
Handles: 8px × 8px, blue-600, rounded
Hover: blue-300 border
Multi-select: blue-500 with transparency
```

### Sidebar Categories

**Blocks Panel**
```
Search bar at top
Collapsible categories:
- Text (H1-H6, paragraph, list)
- Media (image, video, icon)
- Structure (table, columns, spacer)
- Interactive (form, button, checkbox)
- Special (chart, QR, signature)
- AI (text gen, image gen, analyzer)

Each block: 
- Icon (20px)
- Name (text-sm, gray-700)
- Hover: gray-100 bg
- Drag indicator on hover
```

**Templates Panel**
```
Grid view (2 columns)
Thumbnail preview
Template name (text-sm, gray-700)
Category tag (text-xs, gray-500)
Filter by category
Search
```

**Assets Panel**
```
Uploaded images/files
Grid view
Thumbnail preview
File name, size
Upload button prominent
Drag to canvas
```

### Properties Panel

**Tabs**
```
- Style (paint brush icon)
- Layout (layout icon)
- Data (database icon)
- Advanced (settings icon)

Tab height: 48px
Active tab: blue-500 underline
```

**Property Groups**
```
Collapsible sections
Section header: text-sm, semibold, gray-700
Divider: gray-200
Spacing: 16px between groups

Example groups:
- Dimensions (width, height)
- Position (x, y, z-index)
- Typography (font, size, weight, color)
- Background (color, gradient, image)
- Border (width, color, radius)
- Shadow (x, y, blur, color)
```

## Icons

**Icon Set: Lucide Icons**
- Comprehensive set
- Consistent 24px grid
- Customizable stroke-width
- SVG format

**Icon Sizes**
```
xs: 12px  // Inline text icons
sm: 16px  // Small UI elements
md: 20px  // Standard buttons, inputs
lg: 24px  // Large buttons, headings
xl: 32px  // Feature icons
2xl: 48px // Hero sections
```

**Icon Colors**
```
Default: gray-600
Hover: gray-900
Active: blue-600
Disabled: gray-300
```

## Animation & Motion

### Timing Functions

```css
/* Standard easing */
ease-default: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Emphasized (important actions) */
ease-emphasized: cubic-bezier(0.4, 0.0, 0.6, 1);

/* Decelerate (entrances) */
ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);

/* Accelerate (exits) */
ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);

/* Spring (playful) */
ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration

```
instant:  0ms      // No animation
fast:     100ms    // Hover states
normal:   200ms    // Standard transitions
medium:   300ms    // Complex transitions
slow:     500ms    // Page transitions
```

### Animation Principles

**Hover States**
```
Duration: 150ms
Easing: ease-default
Properties: background, border, shadow, transform
```

**Button Press**
```
Duration: 100ms
Easing: ease-accelerate
Transform: scale(0.98)
```

**Modal Open**
```
Duration: 300ms
Easing: ease-decelerate
Properties: opacity, transform
Initial: opacity 0, scale(0.95)
Final: opacity 1, scale(1)
```

**Slide-in Panel**
```
Duration: 300ms
Easing: ease-emphasized
Transform: translateX(-100%) → translateX(0)
```

**Toast Notification**
```
Enter: 300ms, ease-decelerate, translateY(-8px) + opacity
Exit: 200ms, ease-accelerate, translateY(-8px) + opacity
```

## Accessibility

### Focus States

**Keyboard Focus Ring**
```
Ring: 2px solid blue-500
Offset: 2px
Border-radius: same as element
Visible only on keyboard navigation
```

**Focus-within**
```
Container highlight when child focused
Subtle background change (gray-50)
```

### Contrast Ratios

**WCAG AAA Compliance**
```
Normal text: 7:1 minimum
Large text (18px+): 4.5:1 minimum
UI components: 3:1 minimum
```

**Recommended Combinations**
```
gray-900 on white: 16.7:1 ✓
gray-700 on white: 8.6:1 ✓
gray-600 on white: 5.7:1 ✓
blue-600 on white: 4.8:1 ✓
white on blue-600: 4.8:1 ✓
```

### Screen Readers

```
All interactive elements: aria-label
Loading states: aria-busy
Disabled states: aria-disabled
Required fields: aria-required
Error messages: aria-invalid + aria-describedby
```

## Responsive Behavior

**Breakpoints**
```
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Small desktops
xl:  1280px  // Desktops
2xl: 1536px  // Large desktops
```

**Responsive Strategy**
```
Desktop-first design (primary use case)
Tablet: Collapsible side panels
Mobile: Not primary target (desktop app)
```

## Component Library

### Using shadcn-svelte

**Installation**
```bash
npx shadcn-svelte@latest init
```

**Core Components to Use**
```
- Button (all variants)
- Input, Textarea, Select
- Card
- Dialog (modals)
- Dropdown Menu
- Popover
- Tabs
- Tooltip
- Toast (notifications)
- Separator (dividers)
- Scroll Area
- Sheet (side panels)
- Slider (for numeric inputs)
- Switch (toggles)
- Label
```

**Customization**
```
Modify shadcn components to match:
- Color palette (blue-600 primary)
- Border radius (6-8px default)
- Shadow system
- Spacing system
```

## Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          // Custom blue scale
        },
        gray: {
          // Custom gray scale
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // As specified above
      },
      spacing: {
        // As specified above
      },
      borderRadius: {
        // As specified above
      },
      boxShadow: {
        // As specified above
      },
    }
  }
}
```

## Design Guidelines

### Do's
- Use consistent spacing (multiples of 4px)
- Maintain high contrast for text
- Provide clear hover/focus states
- Use primary blue sparingly (only for actions)
- Keep layouts clean and uncluttered
- Use whitespace generously
- Align elements to grid
- Provide loading states
- Show clear error messages

### Don'ts
- Don't use too many colors
- Don't make everything bright blue
- Don't use shadows excessively
- Don't ignore focus states
- Don't use decorative elements without purpose
- Don't make text too small (<14px for body)
- Don't use low-contrast color combinations
- Don't forget disabled states

## Brand References

**Apple**
- Clean, minimalist aesthetic
- Generous whitespace
- Precise typography
- Subtle animations

**Linear**
- High contrast
- Precise alignment
- Fast, purposeful animations
- Clean data presentation

**Vercel**
- Modern, technical aesthetic
- Strong use of black/white
- Blue accents
- Professional typography

**Next.js**
- Clean documentation style
- Clear hierarchy
- Code-friendly design
- Modern sans-serif typography

## Implementation Checklist

- [ ] Install Inter font
- [ ] Install JetBrains Mono font
- [ ] Setup Tailwind with custom config
- [ ] Install shadcn-svelte
- [ ] Create base component variants
- [ ] Implement color system
- [ ] Setup dark mode (optional)
- [ ] Create icon wrapper component
- [ ] Implement focus ring system
- [ ] Create animation utilities
- [ ] Build Storybook/component preview
- [ ] Document all components
- [ ] Accessibility audit
- [ ] Performance audit

## Next Steps

1. Review and approve design system
2. Create Figma prototype (optional)
3. Implement core components
4. Build component library
5. Create example screens
6. User testing
7. Iterate based on feedback

---

**Version:** 1.0.0
**Last Updated:** 2025-12-26
**Maintained By:** Design & Engineering Team

