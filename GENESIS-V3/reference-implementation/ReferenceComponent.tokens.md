# 🎨 REFERENCE COMPONENT - DESIGN TOKENS DOCUMENTATION

## 📋 Overview
This document catalogs all design tokens used by the ReferenceComponent and their mapping to the design system.

## 🎨 Color Tokens

### Interactive Colors
| Token Class | CSS Variable | Hex Value | Usage |
|------------|--------------|-----------|--------|
| `bg-interactive-bg-bold` | `--color-primary-500` | `#1976d2` | Primary background |
| `bg-interactive-bg-bold-hover` | `--color-primary-600` | `#1565c0` | Primary hover state |
| `bg-interactive-bg-bold-pressed` | `--color-primary-700` | `#0d47a1` | Primary active state |
| `text-interactive-text-on-fill` | `--color-neutral-white` | `#ffffff` | Text on filled backgrounds |
| `text-interactive-text-default` | `--color-neutral-900` | `#0f172a` | Default text color |
| `border-interactive-border-bold` | `--color-primary-500` | `#1976d2` | Interactive borders |

### Neutral Colors
| Token Class | CSS Variable | Hex Value | Usage |
|------------|--------------|-----------|--------|
| `bg-neutral-bg-primary` | `--color-neutral-50` | `#fafafa` | Primary neutral background |
| `bg-neutral-bg-secondary` | `--color-neutral-100` | `#f5f5f5` | Secondary neutral background |
| `bg-neutral-bg-tertiary` | `--color-neutral-200` | `#e5e5e5` | Tertiary neutral background |

### Semantic Colors
| Token Class | CSS Variable | Hex Value | Usage |
|------------|--------------|-----------|--------|
| `bg-error-500` | `--color-red-500` | `#ef4444` | Error/destructive background |
| `bg-error-600` | `--color-red-600` | `--color-red-600` | Error hover state |
| `bg-error-700` | `--color-red-700` | `#b91c1c` | Error active state |
| `ring-error-500` | `--color-red-500` | `#ef4444` | Error focus ring |

### State Colors
| Token Class | CSS Variable | Hex Value | Usage |
|------------|--------------|-----------|--------|
| `bg-interactive-border-disabled` | `--color-neutral-300` | `#e0e0e0` | Disabled backgrounds |
| `text-interactive-text-disabled` | `--color-neutral-500` | `#737373` | Disabled text |
| `border-interactive-border-disabled` | `--color-neutral-300` | `#e0e0e0` | Disabled borders |

## 📏 Spacing Tokens

### Padding Scale
| Token Class | Value | Usage |
|------------|-------|--------|
| `px-3` | `12px` | Small horizontal padding |
| `py-1.5` | `6px` | Small vertical padding |
| `px-4` | `16px` | Medium horizontal padding |
| `py-2` | `8px` | Medium vertical padding |
| `px-6` | `24px` | Large horizontal padding |
| `py-3` | `12px` | Large vertical padding |

### Size Scale
| Token Class | Value | Usage |
|------------|-------|--------|
| `h-8` | `32px` | Small component height |
| `h-10` | `40px` | Medium component height |
| `h-12` | `48px` | Large component height |
| `min-w-[64px]` | `64px` | Small minimum width |
| `min-w-[80px]` | `80px` | Medium minimum width |
| `min-w-[96px]` | `96px` | Large minimum width |

## 🔤 Typography Tokens

### Font Properties
| Token Class | Value | Usage |
|------------|-------|--------|
| `font-semibold` | `600` | Component text weight |
| `text-sm` | `14px` | Small/medium text size |
| `text-base` | `16px` | Large text size |

### Layout Properties
| Token Class | Value | Usage |
|------------|-------|--------|
| `inline-flex` | `inline-flex` | Display property |
| `items-center` | `center` | Vertical alignment |
| `justify-center` | `center` | Horizontal alignment |

## 🎯 Interactive State Tokens

### Focus States
| Token Class | Value | Usage |
|------------|-------|--------|
| `focus-visible:outline-none` | `none` | Remove default outline |
| `focus-visible:ring-2` | `2px` | Focus ring width |
| `focus-visible:ring-offset-2` | `2px` | Focus ring offset |
| `focus-visible:ring-primary-500` | `var(--color-primary-500)` | Primary focus color |

### Hover States
| Variant | Token Pattern | Example |
|---------|--------------|---------|
| Primary | `hover:bg-interactive-bg-bold-hover` | Darker primary |
| Secondary | `hover:bg-neutral-bg-secondary` | Light gray background |
| Destructive | `hover:bg-error-600` | Darker red |

### Disabled States
| Token Class | Value | Usage |
|------------|-------|--------|
| `disabled:pointer-events-none` | `none` | Disable interactions |
| `disabled:cursor-not-allowed` | `not-allowed` | Show disabled cursor |
| `disabled:bg-interactive-border-disabled` | Disabled background | All variants |
| `disabled:text-interactive-text-disabled` | Disabled text | All variants |

## 🔄 Transition Tokens

| Token Class | Value | Usage |
|------------|-------|--------|
| `transition-colors` | `color, background-color, border-color` | Smooth color transitions |
| `duration-200` | `200ms` | Transition duration |

## 📱 Responsive Tokens

| Token Class | Value | Usage |
|------------|-------|--------|
| `w-full` | `100%` | Full width variant |

## 🚀 Token Usage Guidelines

### ✅ Do's
- Always use token classes, never hardcode values
- Use semantic token names that describe purpose
- Follow the established naming convention
- Document any new tokens added

### ❌ Don'ts
- Don't use arbitrary values like `bg-[#1976d2]`
- Don't create one-off tokens for specific components
- Don't mix token systems (stick to design system tokens)
- Don't override token values with inline styles

## 🔗 Token References

### Tailwind Config
All tokens are defined in `tailwind.config.js` and map to CSS custom properties:

```javascript
// Example from tailwind.config.js
colors: {
  interactive: {
    bg: {
      bold: 'var(--color-primary-500)',
      'bold-hover': 'var(--color-primary-600)',
      'bold-pressed': 'var(--color-primary-700)',
    },
    text: {
      'on-fill': 'var(--color-neutral-white)',
      'default': 'var(--color-neutral-900)',
      'disabled': 'var(--color-neutral-500)',
    },
    border: {
      'bold': 'var(--color-primary-500)',
      'disabled': 'var(--color-neutral-300)',
    }
  }
}
```

### CSS Custom Properties
Root level CSS variables defined in `globals.css`:

```css
:root {
  /* Primary Palette */
  --color-primary-500: #1976d2;
  --color-primary-600: #1565c0;
  --color-primary-700: #0d47a1;
  
  /* Neutral Palette */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #e0e0e0;
  --color-neutral-500: #737373;
  --color-neutral-900: #0f172a;
  --color-neutral-white: #ffffff;
  
  /* Semantic Colors */
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;
  --color-red-700: #b91c1c;
}
```