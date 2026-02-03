# Theme System Documentation

This directory contains the centralized theme configuration for the entire Nexus CRM application. All colors, fonts, and design tokens are defined here to ensure consistency and easy maintenance.

## 📁 File Structure

```
theme/
├── colors.ts       # Main theme configuration file
└── README.md       # This documentation
```

## 🎨 Overview

The theme system provides a single source of truth for all visual styling in the application. Instead of hardcoding colors throughout components, we use semantic theme tokens that automatically adapt to light/dark mode.

### Benefits

✅ **Consistency** - All components use the same color palette  
✅ **Maintainability** - Change colors in one place to update entire app  
✅ **Dark Mode** - Automatic light/dark mode support  
✅ **Type Safety** - TypeScript autocomplete for all theme tokens  
✅ **Scalability** - Easy to add new colors or modify existing ones

## 🚀 Quick Start

### Basic Usage

```tsx
import { getThemeColors } from '@/theme/colors';

function MyComponent({ isDarkMode }: { isDarkMode: boolean }) {
  const theme = getThemeColors(isDarkMode);
  
  return (
    <div className={`${theme.neutral.background} ${theme.text.primary}`}>
      <button className={theme.button.primary}>
        Click Me
      </button>
    </div>
  );
}
```

### Using Font Styles

```tsx
import { fonts } from '@/theme/colors';

const styles = {
  fontFamily: fonts.family.sans,
  fontSize: fonts.size.lg,
  fontWeight: fonts.weight.bold,
  letterSpacing: fonts.tracking.wide,
};
```

## 🎯 Theme Categories

### 1. Primary Colors (Brand Orange)

Used for primary actions, buttons, and brand elements.

```tsx
theme.primary.main         // bg-orange-500
theme.primary.hover        // hover:bg-orange-600
theme.primary.text         // text-orange-500
theme.primary.darkText     // Adaptive text color for dark mode
theme.primary.gradient     // from-orange-500 to-orange-600
```

### 2. Neutral Colors (Backgrounds & Borders)

Used for backgrounds, cards, and container elements.

```tsx
theme.neutral.background           // Main background
theme.neutral.backgroundSecondary  // Secondary background
theme.neutral.card                 // Card background
theme.neutral.hover                // Hover state
```

### 3. Text Colors

Used for all text elements with semantic hierarchy.

```tsx
theme.text.primary    // Main text color
theme.text.secondary  // Secondary text (descriptions)
theme.text.tertiary   // Tertiary text (labels, captions)
theme.text.muted      // Muted text (placeholders)
theme.text.heading    // Headings and titles
```

### 4. Status Colors

Used for feedback, notifications, and states.

```tsx
// Success (Green)
theme.status.success.bg
theme.status.success.text
theme.status.success.main

// Error (Red)
theme.status.error.bg
theme.status.error.text
theme.status.error.border

// Warning (Yellow)
theme.status.warning.bg
theme.status.warning.text

// Info (Blue)
theme.status.info.bg
theme.status.info.text
```

### 5. Input/Form Styles

Used for form elements and inputs.

```tsx
theme.input.background      // Input background
theme.input.border          // Input border
theme.input.text            // Input text color
theme.input.placeholder     // Placeholder text
```

### 6. Button Styles

Pre-configured button style combinations.

```tsx
theme.button.primary    // Primary action button
theme.button.secondary  // Secondary button
theme.button.outline    // Outline button
```

### 7. Dropdown/Menu Styles

Used for dropdown menus and context menus.

```tsx
theme.dropdown.bg        // Dropdown background
theme.dropdown.item      // Menu item text
theme.dropdown.itemHover // Item hover state
theme.dropdown.danger    // Danger/delete action
```

## 📝 Complete Example

Here's a complete component using the theme system:

```tsx
import React, { useState } from 'react';
import { getThemeColors } from '@/theme/colors';

interface MyCardProps {
  title: string;
  description: string;
  isDarkMode: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const MyCard: React.FC<MyCardProps> = ({
  title,
  description,
  isDarkMode,
  onSubmit,
  onCancel
}) => {
  const theme = getThemeColors(isDarkMode);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <div className={`rounded-xl border p-6 ${theme.neutral.card} ${theme.border.main}`}>
      {/* Heading */}
      <h2 className={`text-2xl font-bold mb-2 ${theme.text.heading}`}>
        {title}
      </h2>
      
      {/* Description */}
      <p className={`mb-6 ${theme.text.secondary}`}>
        {description}
      </p>

      {/* Input Field */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>
          Enter Value <span className={theme.status.error.main}>*</span>
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here..."
          className={`w-full px-4 py-2.5 rounded-lg border ${
            error 
              ? `${theme.status.error.border}` 
              : `${theme.border.input} ${theme.primary.focus}`
          } ${theme.input.background} ${theme.input.text} ${theme.input.placeholder}`}
        />
        {error && <p className={`text-xs mt-1 ${theme.status.error.main}`}>{error}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className={`flex-1 px-4 py-2 rounded-lg transition-all ${theme.button.secondary}`}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className={`flex-1 px-4 py-2 rounded-lg transition-all ${theme.button.primary}`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
```

## 🔧 Customization

### Changing Primary Brand Color

To change the primary brand color from orange to another color:

1. Open `src/theme/colors.ts`
2. Modify the `primaryColors` object:

```ts
export const primaryColors = {
  50: '#eff6ff',
  100: '#dbeafe',
  // ... etc
  500: '#3b82f6', // Changed from orange to blue
  600: '#2563eb',
  // ... etc
};
```

3. All components will automatically use the new color!

### Adding New Color Tokens

To add a new custom color:

1. Add it to `colors.ts`:

```ts
export const brandColors = {
  accent: '#10b981',
  highlight: '#6366f1',
};
```

2. Add it to the theme getter:

```ts
export const getThemeColors = (isDarkMode: boolean) => {
  return {
    // ... existing tokens
    brand: {
      accent: 'bg-emerald-500',
      highlight: 'bg-indigo-500',
    },
  };
};
```

3. Use it in components:

```tsx
<div className={theme.brand.accent}>Custom Color</div>
```

### Modifying Dark Mode Colors

To customize dark mode appearance:

1. Open `src/theme/colors.ts`
2. Modify the `darkModeColors` object:

```ts
export const darkModeColors = {
  background: {
    primary: '#1a1a1a',    // Changed from '#0F1115'
    secondary: '#242424',   // Changed from '#16191F'
    // ... etc
  },
  // ... etc
};
```

## 📚 API Reference

### `getThemeColors(isDarkMode: boolean)`

Returns a comprehensive object containing all theme tokens adapted for the current mode.

**Parameters:**
- `isDarkMode` (boolean): Whether dark mode is enabled

**Returns:** Theme object with all color utilities

### `colors`

Static color palette constants. Use these when you need specific color values:

```ts
import { colors } from '@/theme/colors';

const myOrangeValue = colors.primary[500]; // '#f97316'
const myNeutralValue = colors.neutral[200]; // '#e2e8f0'
```

### `fonts`

Font configuration constants:

```ts
import { fonts } from '@/theme/colors';

const fontFamily = fonts.family.sans;
const fontSize = fonts.size.lg;
const fontWeight = fonts.weight.bold;
```

### `generateCSSVariables(isDarkMode: boolean)`

Generates CSS custom properties for use in global styles:

```ts
const cssVars = generateCSSVariables(isDarkMode);
// Returns: { '--color-primary': '#f97316', ... }
```

## 🎯 Best Practices

### ✅ DO

- **Always use theme tokens** instead of hardcoded colors
- **Pass isDarkMode** from parent components
- **Use semantic names** (e.g., `theme.status.error` not `theme.colors.red`)
- **Combine theme tokens** for complex styles

```tsx
// ✅ Good
<button className={`${theme.button.primary} rounded-lg`}>
  Click Me
</button>
```

### ❌ DON'T

- **Don't hardcode colors** in components
- **Don't use Tailwind colors directly** when theme tokens exist
- **Don't create custom color classes** without adding to theme

```tsx
// ❌ Bad
<button className="bg-orange-500 hover:bg-orange-600">
  Click Me
</button>

// ✅ Good
<button className={theme.button.primary}>
  Click Me
</button>
```

## 🔄 Migration Guide

If you're updating an existing component to use the theme system:

### Before (Hardcoded Colors)

```tsx
function OldComponent({ isDarkMode }: Props) {
  return (
    <div className={isDarkMode ? 'bg-[#16191F] text-white' : 'bg-white text-slate-900'}>
      <button className="bg-orange-500 hover:bg-orange-600 text-white">
        Action
      </button>
    </div>
  );
}
```

### After (Using Theme)

```tsx
import { getThemeColors } from '@/theme/colors';

function NewComponent({ isDarkMode }: Props) {
  const theme = getThemeColors(isDarkMode);
  
  return (
    <div className={`${theme.neutral.card} ${theme.text.primary}`}>
      <button className={theme.button.primary}>
        Action
      </button>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Theme not updating

**Problem:** Colors don't change when switching dark mode  
**Solution:** Ensure you're passing `isDarkMode` prop and calling `getThemeColors(isDarkMode)`

### Incorrect colors in production

**Problem:** Colors look different after build  
**Solution:** Make sure Tailwind purge is configured correctly to include theme tokens

### TypeScript errors

**Problem:** TypeScript complaining about theme properties  
**Solution:** Ensure you're importing from the correct path: `@/theme/colors` or `../theme/colors`

## 📞 Support

For questions or issues with the theme system:

1. Check this documentation
2. Review examples in existing components
3. Contact the development team

## 🔗 Related Files

- **Main Config:** `src/theme/colors.ts`
- **Example Usage:** `src/components/Modal.tsx`
- **More Examples:** `src/app/modules/pos/components/AddCustomerModal.tsx`

---

**Last Updated:** February 3, 2026  
**Version:** 1.0.0
