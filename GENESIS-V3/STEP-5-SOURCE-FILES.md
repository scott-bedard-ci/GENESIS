# STEP 5: Source Files & Types

This step creates all the type definitions, utilities, and initial source files needed for the design system.

## Type Definitions

### 🚨 CREATE THIS FILE: `src/types/tokens.ts`
```typescript
/**
 * Design token type definitions
 * These types ensure type safety when using design tokens throughout the system
 */

// Color token structure matching Figma token organization
export interface ColorTokens {
  neutral: {
    bg: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      disabled: string;
    };
    border: {
      default: string;
      strong: string;
      subtle: string;
    };
  };
  interactive: {
    bg: {
      bold: string;
      'bold-hover': string;
      'bold-pressed': string;
      subtle: string;
      'subtle-hover': string;
    };
    text: {
      default: string;
      'on-fill': string;
      hover: string;
      disabled: string;
    };
    border: {
      default: string;
      bold: string;
      hover: string;
      focus: string;
      disabled: string;
    };
  };
  primary: Record<string, string>;
  error: Record<string, string>;
  warning: Record<string, string>;
  success: Record<string, string>;
  info: Record<string, string>;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface TypographyTokens {
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
}

export interface EffectTokens {
  boxShadow: {
    sm: string;
    default: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    default: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  opacity: {
    0: string;
    5: string;
    10: string;
    20: string;
    25: string;
    30: string;
    40: string;
    50: string;
    60: string;
    70: string;
    75: string;
    80: string;
    90: string;
    95: string;
    100: string;
  };
}

export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  effects: EffectTokens;
  breakpoints: BreakpointTokens;
}
```

### 🚨 CREATE THIS FILE: `src/types/component.ts`
```typescript
/**
 * Base component type definitions
 * These types are extended by all components in the design system
 */

import { VariantProps } from 'class-variance-authority';

// Base props that all components should accept
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Common size variants used across components
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Common variant types
export type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';

// Common status types
export type Status = 'default' | 'success' | 'warning' | 'error' | 'info';

// Polymorphic component helper types
export type PolymorphicRef<C extends React.ElementType> = 
  React.ComponentPropsWithRef<C>['ref'];

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = Props &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props> & {
    as?: C;
    ref?: PolymorphicRef<C>;
  };

// Helper type for components using CVA
export type ComponentVariants<T extends (...args: any) => any> = 
  VariantProps<T> & BaseComponentProps;

// Strict component props helper - ensures all required props are defined
export type StrictProps<T> = T & {
  [K in keyof T]-?: T[K];
};

// Props for components that can be disabled
export interface DisableableProps {
  disabled?: boolean;
  'aria-disabled'?: boolean;
}

// Props for components with loading states
export interface LoadableProps {
  loading?: boolean;
  'aria-busy'?: boolean;
}

// Props for form-related components
export interface FormComponentProps {
  name?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  required?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

// Props for components with tooltips
export interface TooltipProps {
  tooltip?: string;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
  tooltipDelay?: number;
}

// Responsive prop helper
export type ResponsiveProp<T> = T | {
  mobile?: T;
  tablet?: T;
  desktop?: T;
};

// Component metadata for documentation
export interface ComponentMetadata {
  displayName: string;
  description?: string;
  category: 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages';
  tags?: string[];
  figmaNodeId?: string;
  version?: string;
}
```

## Utilities

### 🚨 CREATE THIS FILE: `src/utils/classNames.ts`
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for constructing className strings conditionally.
 * Combines clsx and tailwind-merge for optimal Tailwind CSS class handling.
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', { 'object-syntax': true })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Filters out undefined values from className arrays
 */
export function filterClasses(...classes: (string | undefined)[]): string {
  return classes.filter(isDefined).join(' ');
}

/**
 * Generates responsive classes based on breakpoint values
 */
export function responsiveClasses<T extends string>(
  baseClass: string,
  value: T | { mobile?: T; tablet?: T; desktop?: T }
): string {
  if (typeof value === 'string') {
    return `${baseClass}-${value}`;
  }

  const classes: string[] = [];
  if (value.mobile) classes.push(`${baseClass}-${value.mobile}`);
  if (value.tablet) classes.push(`md:${baseClass}-${value.tablet}`);
  if (value.desktop) classes.push(`lg:${baseClass}-${value.desktop}`);
  
  return classes.join(' ');
}
```

### 🚨 CREATE THIS FILE: `src/utils/componentVariants.ts`
```typescript
/**
 * Shared component variant utilities
 * These utilities help create consistent variant patterns across components
 */

import { cva } from 'class-variance-authority';

/**
 * Base focus styles shared across all interactive components
 */
export const focusRingStyles = [
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-primary-500',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-neutral-bg-primary'
];

/**
 * Base disabled styles shared across all interactive components
 */
export const disabledStyles = [
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50'
];

/**
 * Common transition styles for smooth interactions
 */
export const transitionStyles = [
  'transition-all',
  'duration-200',
  'ease-in-out'
];

/**
 * Creates size variants with consistent scaling
 */
export function createSizeVariants(
  config: Record<string, { padding: string; fontSize: string; height?: string }>
) {
  return Object.entries(config).reduce((acc, [size, values]) => {
    const classes = [values.padding, values.fontSize];
    if (values.height) classes.push(values.height);
    acc[size] = classes;
    return acc;
  }, {} as Record<string, string[]>);
}

/**
 * Creates color variants with consistent theming
 */
export function createColorVariants(
  config: Record<string, {
    base: string[];
    hover?: string[];
    active?: string[];
    disabled?: string[];
  }>
) {
  return Object.entries(config).reduce((acc, [variant, values]) => {
    const classes = [...values.base];
    
    if (values.hover) {
      classes.push(...values.hover.map(c => `hover:${c}`));
    }
    
    if (values.active) {
      classes.push(...values.active.map(c => `active:${c}`));
    }
    
    if (values.disabled) {
      const disabledClasses = values.disabled.map(c => `disabled:${c}`);
      classes.push(...disabledClasses);
    }
    
    acc[variant] = classes;
    return acc;
  }, {} as Record<string, string[]>);
}

/**
 * Combines multiple variant configurations into a single cva config
 */
export function combineVariants<T extends Record<string, any>>(
  ...configs: T[]
): T {
  return configs.reduce((acc, config) => {
    Object.entries(config).forEach(([key, value]) => {
      if (acc[key] && typeof value === 'object' && !Array.isArray(value)) {
        acc[key] = { ...acc[key], ...value };
      } else {
        acc[key] = value;
      }
    });
    return acc;
  }, {} as T);
}

/**
 * Helper to create compound variants
 */
export function createCompoundVariant<T extends Record<string, any>>(
  conditions: T,
  className: string | string[]
) {
  return {
    ...conditions,
    className: Array.isArray(className) ? className : [className]
  };
}
```

### 🚨 CREATE THIS FILE: `src/utils/storybook.tsx`
```typescript
/**
 * Storybook utility functions
 * These utilities help create consistent stories across components
 */

import type { ArgTypes, Args } from '@storybook/react';

/**
 * Common argTypes for component props
 */
export const commonArgTypes: ArgTypes = {
  className: {
    control: 'text',
    description: 'Additional CSS classes to apply',
    table: {
      category: 'Styling',
    },
  },
  children: {
    control: 'text',
    description: 'Content to render inside the component',
    table: {
      category: 'Content',
    },
  },
  'data-testid': {
    control: 'text',
    description: 'Test ID for testing purposes',
    table: {
      category: 'Testing',
    },
  },
};

/**
 * Size control configuration
 */
export const sizeArgType = (sizes: readonly string[]) => ({
  control: 'select',
  options: sizes,
  description: 'Size variant of the component',
  table: {
    category: 'Appearance',
    defaultValue: { summary: 'md' },
  },
});

/**
 * Variant control configuration
 */
export const variantArgType = (variants: readonly string[]) => ({
  control: 'select',
  options: variants,
  description: 'Visual variant of the component',
  table: {
    category: 'Appearance',
    defaultValue: { summary: 'primary' },
  },
});

/**
 * Boolean control configuration
 */
export const booleanArgType = (description: string, defaultValue = false) => ({
  control: 'boolean',
  description,
  table: {
    category: 'State',
    defaultValue: { summary: defaultValue.toString() },
  },
});

/**
 * Disabled states for interactive components
 */
export const disabledArgType = booleanArgType(
  'Whether the component is disabled',
  false
);

/**
 * Loading states for async components
 */
export const loadingArgType = booleanArgType(
  'Whether the component is in a loading state',
  false
);

/**
 * Helper to create viewport parameters
 */
export function createViewportParams(defaultViewport: 'mobile' | 'tablet' | 'desktop') {
  return {
    viewport: {
      defaultViewport,
    },
  };
}

/**
 * Helper to create a11y parameters
 */
export function createA11yParams(config?: any) {
  return {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          ...((config?.rules || []) as any[]),
        ],
      },
    },
  };
}

/**
 * Creates a story template with common setup
 */
export function createStoryTemplate<T>(
  Component: React.ComponentType<T>,
  defaultArgs?: Partial<T>
) {
  const Template = (args: T) => <Component {...args} />;
  
  if (defaultArgs) {
    Template.args = defaultArgs as Args;
  }
  
  return Template;
}

/**
 * Decorators for common story wrappers
 */
export const paddingDecorator = (padding = '2rem') => (Story: any) => (
  <div style={{ padding }}>
    <Story />
  </div>
);

export const centerDecorator = (Story: any) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <Story />
  </div>
);

export const darkBackgroundDecorator = (Story: any) => (
  <div style={{ backgroundColor: '#1a1a1a', padding: '2rem' }}>
    <Story />
  </div>
);
```

## Global Styles

### 🚨 CREATE THIS FILE: `src/styles/globals.css`
```css
/**
 * Global styles for Pigment-Genesis Design System
 * Imports Tailwind CSS and sets up CSS custom properties
 */

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import generated CSS variables from Figma tokens 
   Note: This file is created by npm run extract-figma-tokens
   A placeholder is created during setup to prevent build errors */
@import './tokens/css-variables.generated.css';

/* Custom font setup */
@font-face {
  font-family: 'Sharp Sans';
  font-weight: 500;
  font-style: normal;
  src: url('/fonts/SharpSans-Medium.woff2') format('woff2'),
       url('/fonts/SharpSans-Medium.woff') format('woff');
  font-display: swap;
}

/* Base styles */
@layer base {
  /* Set default font */
  html {
    font-family: 'Sharp Sans', system-ui, -apple-system, sans-serif;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Remove default margins */
  body {
    margin: 0;
    background-color: var(--color-neutral-bg-primary);
    color: var(--color-neutral-text-primary);
  }

  /* Consistent box sizing */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default button styles */
  button {
    font-family: inherit;
    font-weight: inherit;
  }

  /* Focus visible only for keyboard navigation */
  *:focus {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
}

/* Component utilities */
@layer utilities {
  /* Text rendering optimization */
  .text-render-optimize {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scroll behavior */
  .scroll-smooth {
    scroll-behavior: smooth;
  }

  /* Hide scrollbar utility */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Touch target minimum size */
  .touch-target {
    position: relative;
    @apply after:absolute after:inset-0 after:min-w-[44px] after:min-h-[44px];
  }

  /* Truncate text utilities */
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Animation utilities */
@layer utilities {
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slide-in-up {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-in-down {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 200ms ease-in-out;
  }

  .animate-fade-out {
    animation: fade-out 200ms ease-in-out;
  }

  .animate-slide-in-up {
    animation: slide-in-up 200ms ease-out;
  }

  .animate-slide-in-down {
    animation: slide-in-down 200ms ease-out;
  }
}

/* Print styles */
@media print {
  /* Hide non-essential elements */
  .no-print {
    display: none !important;
  }

  /* Ensure good contrast */
  * {
    color: black !important;
    background: white !important;
  }

  /* Page breaks */
  .page-break-before {
    page-break-before: always;
  }

  .page-break-after {
    page-break-after: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }
}
```

## Reference Component Implementation

### 🚨 COPY REFERENCE IMPLEMENTATION FILES

The reference component serves as the gold standard template for ALL components. Copy the complete reference implementation from GENESIS-V3:

```bash
# Create the reference directory
mkdir -p src/_reference

# Copy all reference files
cp GENESIS-V3/reference-implementation/* src/_reference/
```

**CRITICAL**: These files demonstrate the EXACT patterns every component must follow:
- Complete 7-file structure
- CVA + Tailwind architecture  
- Comprehensive documentation format
- Test organization patterns
- Story structure templates

These files are:
- `ReferenceComponent.tsx` - Perfect CVA + Tailwind implementation
- `ReferenceComponent.figmaframes.md` - Figma documentation template
- `ReferenceComponent.stories.tsx` - Story structure template
- `ReferenceComponent.test.tsx` - Test organization template
- `ReferenceComponent.tokens.md` - Token documentation template
- `index.ts` - Export patterns
- `README.md` - Reference documentation

## Index Files

### 🚨 CREATE THIS FILE: `src/index.ts`
```typescript
/**
 * Main entry point for Pigment-Genesis Design System
 * Exports all components, hooks, utilities, and types
 */

// Components - organized by atomic level
export * from './components';

// Hooks
export * from './hooks/useAccessibility';
export * from './hooks/useComponentState';

// Utilities
export { cn } from './utils/classNames';
export type { 
  ComponentVariants,
  BaseComponentProps,
  DisableableProps,
  LoadableProps,
  FormComponentProps,
  ResponsiveProp,
  Size,
  Variant,
  Status
} from './types/component';

// Version
export const VERSION = '1.0.0';
```

### 🚨 CREATE THIS FILE: `src/components/index.ts`
```typescript
/**
 * Component library exports
 * All components are organized by atomic design level
 */

// Atoms - Basic building blocks
export * from './atoms';

// Molecules - Composed components
export * from './molecules';

// Organisms - Complex components
export * from './organisms';
```

### 🚨 CREATE THIS FILE: `src/components/atoms/index.ts`
```typescript
/**
 * Atom components - Basic building blocks
 * Export all atom components here
 */

// Components will be added here as they are created
// Example: export * from './Button';
export {};
```

### 🚨 CREATE THIS FILE: `src/components/molecules/index.ts`
```typescript
/**
 * Molecule components - Composed from atoms
 * Export all molecule components here
 */

// Components will be added here as they are created
// Example: export * from './SearchBar';
export {};
```

### 🚨 CREATE THIS FILE: `src/components/organisms/index.ts`
```typescript
/**
 * Organism components - Complex UI sections
 * Export all organism components here
 */

// Components will be added here as they are created
// Example: export * from './Header';
export {};
```

## Storybook Welcome Page

### 🚨 CREATE THIS FILE: `src/Welcome.stories.tsx`
```typescript
import type { Meta, StoryObj } from '@storybook/react';

const Welcome = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Pigment Genesis
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive design system for CustomInk built with React, TypeScript, and Tailwind CSS
        </p>
        <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
          🎨 Design System v1.0.0
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            🧱 Atomic Design
          </h2>
          <p className="text-gray-600 mb-4">
            Components are organized using atomic design methodology:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>Atoms:</strong> Basic building blocks (buttons, inputs)</li>
            <li>• <strong>Molecules:</strong> Simple combinations of atoms</li>
            <li>• <strong>Organisms:</strong> Complex UI sections</li>
            <li>• <strong>Templates:</strong> Page-level layouts</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            🎯 Design Tokens
          </h2>
          <p className="text-gray-600 mb-4">
            All components use design tokens extracted directly from Figma:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• Colors, spacing, and typography from Figma</li>
            <li>• Instant rebrand capability</li>
            <li>• 100% design consistency</li>
            <li>• CVA + Tailwind architecture</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          🚀 Getting Started
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">1. Browse Components</h3>
            <p className="text-blue-700 text-sm">
              Explore the component library in the sidebar
            </p>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">2. View Documentation</h3>
            <p className="text-blue-700 text-sm">
              Each component includes usage guidelines and examples
            </p>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">3. Interactive Controls</h3>
            <p className="text-blue-700 text-sm">
              Use the Controls panel to test component variations
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            📚 Documentation
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Component usage guidelines</li>
            <li>• Accessibility requirements</li>
            <li>• Design principles</li>
            <li>• Code examples</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            🔧 Development Tools
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• TypeScript for type safety</li>
            <li>• Jest for testing</li>
            <li>• ESLint for code quality</li>
            <li>• Accessibility testing with axe-core</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500">
        <p>Built with ❤️ by the CustomInk Design System Team</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof Welcome> = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <div className="prose max-w-none">
          <h1>Pigment Genesis Design System</h1>
          <p>
            Welcome to the Pigment Genesis Design System documentation. This design system provides
            a comprehensive library of reusable components built with React, TypeScript, and Tailwind CSS.
          </p>
          
          <h2>Key Features</h2>
          <ul>
            <li><strong>Figma Integration:</strong> All components are built from Figma designs with extracted design tokens</li>
            <li><strong>Atomic Design:</strong> Components organized using atomic design methodology</li>
            <li><strong>Accessibility First:</strong> All components meet WCAG accessibility standards</li>
            <li><strong>Type Safe:</strong> Full TypeScript support with comprehensive type definitions</li>
            <li><strong>Testing:</strong> Comprehensive test coverage including accessibility tests</li>
          </ul>

          <h2>Architecture</h2>
          <p>
            Components use Class Variance Authority (CVA) with Tailwind CSS classes that reference design tokens.
            This architecture ensures consistency and enables instant rebranding through design token updates.
          </p>

          <h2>Getting Started</h2>
          <p>
            Browse the component library using the sidebar navigation. Each component includes:
          </p>
          <ul>
            <li>Interactive examples with configurable controls</li>
            <li>Usage guidelines and best practices</li>
            <li>Accessibility information</li>
            <li>Code examples and API documentation</li>
          </ul>
        </div>
      ),
    },
  },
};

export default meta;
type Story = StoryObj<typeof Welcome>;

export const Default: Story = {};
```

### 🚨 UPDATE STORYBOOK CONFIG: `.storybook/main.ts`
Update the stories array to prioritize the Welcome page:
```typescript
const config: StorybookConfig = {
  stories: [
    '../src/Welcome.stories.tsx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  // ... rest of config
};
```

## ✅ Source Files Complete

You should now have created:
- Type definitions for tokens and components
- Utility functions for className handling and variants
- Storybook utility helpers (note: .tsx extension for JSX support)
- Global CSS styles with design token imports
- Main index files for clean exports
- Component category index files (atoms, molecules, organisms)
- **Storybook Welcome page with comprehensive documentation**

Total files created in this step: **10 files**

## 📋 Next Step

👉 **Continue to [FINAL-VALIDATION.md](./FINAL-VALIDATION.md)** to verify all 35+ files were created correctly.