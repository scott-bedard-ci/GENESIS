# STEP 1: Core Configuration Files

This step creates all the core configuration files needed for the project.

## TypeScript Configuration

### 🚨 CREATE THIS FILE: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 🚨 CREATE THIS FILE: `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": [
    "vite.config.ts",
    "tsup.config.ts",
    "tailwind.config.js",
    "postcss.config.js"
  ]
}
```

## Tailwind Configuration

### 🚨 CREATE THIS FILE: `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */

// 🚨 CRITICAL: This file imports GENERATED token mappings
// DO NOT hardcode any values here - everything comes from Figma

// Gracefully handle missing token file during initial setup
let tokens = { colors: {}, spacing: {} };
try {
  tokens = require('./src/tokens/tailwind-tokens.generated.js');
} catch (e) {
  console.warn('⚠️  Token file not found. Run: npm run extract-figma-tokens');
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./stories/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: tokens.colors || {},      // ALL colors from Figma - NEVER hardcode
      spacing: tokens.spacing || {},    // ALL spacing from Figma - NEVER hardcode
      fontSize: tokens.fontSize || {},  // ALL font sizes from Figma
      fontFamily: tokens.fontFamily || {}, // Font families from Figma
      fontWeight: tokens.fontWeight || {}, // Font weights from Figma
      lineHeight: tokens.lineHeight || {}, // Line heights from Figma
      borderRadius: tokens.borderRadius || {}, // Border radii from Figma
      boxShadow: tokens.boxShadow || {}, // Shadows from Figma
      // 🚨 NO HARDCODED VALUES ALLOWED
      // Everything must reference the generated tokens object
    }
  },
  plugins: []
}
```

### 🚨 CREATE THIS FILE: `postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## Jest Configuration

### 🚨 CREATE THIS FILE: `jest.config.js`
```javascript
/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/types/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.test.{ts,tsx}'
  ]
};
```

### 🚨 CREATE THIS FILE: `jest.setup.js`
```javascript
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

## Build Configuration

### 🚨 CREATE THIS FILE: `tsup.config.ts`
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
});
```

## Linting Configuration

### 🚨 CREATE THIS FILE: `.eslintrc.js`
```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'jsx-a11y/anchor-is-valid': 'off',
  },
};
```

### 🚨 CREATE THIS FILE: `.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Storybook Configuration

### 🚨 CREATE THIS FILE: `.storybook/main.ts`
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
```

### 🚨 CREATE THIS FILE: `.storybook/preview.ts`
```typescript
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
};

export default preview;
```

## Figma Configuration

### 🚨 CREATE THIS FILE: `figma.config.json`
```json
{
  "fileId": "YOUR_FIGMA_FILE_ID",
  "personalAccessToken": "YOUR_FIGMA_PAT",
  "tokenPages": {
    "colors": "Colors",
    "spacing": "Spacing", 
    "typography": "Typography",
    "effects": "Effects"
  },
  "componentFrames": {
    "atoms": "Atoms",
    "molecules": "Molecules",
    "organisms": "Organisms"
  },
  "exportSettings": {
    "format": "png",
    "scale": 2,
    "contentsOnly": true
  }
}
```

## ✅ Configuration Complete

You should now have created:
- TypeScript configuration (tsconfig.json, tsconfig.node.json)
- Tailwind and PostCSS configuration
- Jest configuration and setup
- Build configuration (tsup)
- Linting configuration (ESLint, Prettier)
- Storybook configuration
- Figma configuration template

Total files created in this step: **10**

## 📋 Next Step

👉 **Continue to [STEP-2-VALIDATION-SCRIPTS.md](./STEP-2-VALIDATION-SCRIPTS.md)**