# INIT: Project Initialization

## 🚨 PRIME DIRECTIVE: QUALITY IS THE ONLY METRIC THAT MATTERS

**CRITICAL MINDSET: Building components perfectly is infinitely more important than building them quickly or cheaply.**

### Quality Requirements:
- **100% Figma fidelity** - Every pixel must match exactly
- **100% architectural compliance** - Every pattern must be followed precisely  
- **100% design token usage** - No shortcuts or hardcoded values
- **100% test coverage** - Every interaction and state must be tested
- **100% accessibility standards** - Every WCAG requirement must be met
- **100% documentation completeness** - Every component fully documented

### Time and Cost Are NOT Factors:
- **Take unlimited time** to achieve perfection
- **Use unlimited tool calls** for thorough analysis
- **Run unlimited validations** until everything passes
- **Iterate unlimited times** to match Figma exactly
- **Request unlimited clarifications** - ambiguity leads to poor quality

## 🎭 MODEL ROLES & RESPONSIBILITIES

### Claude Opus 4 - The Architect
- **Role**: System architect and quality gatekeeper
- **Use for**: Initial setup, architectural decisions, pattern changes, learning log reviews
- **Instructions**: CLAUDE-OPUS.md

### Claude Sonnet 4 - The Implementer  
- **Role**: Component developer and system builder
- **Use for**: Component development, routine tasks, bug fixes, minor updates
- **Instructions**: CLAUDE.md

## 📋 THE LEARNING LOG SYSTEM

**LEARNING-LOG.md** - Where Sonnet documents discoveries for Opus review:
- Critical issues trigger immediate Opus involvement
- Non-critical issues reviewed daily
- Architectural improvements tracked in VERSION-HISTORY.md

## 🚨 PHASE 0: DESIGN SYSTEM ASSET DISCOVERY

Before ANY technical setup, we must catalog existing design system assets.

### Critical Questions to Ask the User:

#### 1. **Design Tokens Discovery**
Ask: **"Do you have a master list or documentation of your design tokens that we can import?"**

**What to look for:**
- ✅ **Figma Variables/Tokens**: Complete token definitions in Figma
- ✅ **Design Token JSON**: Exported token files (Design Tokens format, Style Dictionary, etc.)
- ✅ **Design Documentation**: Spreadsheets, PDFs, or docs with color palettes, spacing scales, typography
- ✅ **Existing CSS Variables**: CSS custom properties from current systems
- ✅ **Style Guides**: Brand guidelines with specific values

**If they have tokens:**
- Request Figma file access for token extraction
- Ask for any exported token files
- Get brand guideline documents
- Document token sources in figma.config.json

**If they don't have organized tokens:**
- Plan token extraction directly from component designs
- Suggest creating token organization in Figma first
- Document this gap in LEARNING-LOG.md

#### 2. **Icon System Discovery**  
Ask: **"Do you have an established icon system/library? Can you point us to the Figma frames containing your complete icon set?"**

**What to look for:**
- ✅ **Icon Library Frame**: Dedicated Figma frame with all icons
- ✅ **Icon Components**: Figma components for icons with variants
- ✅ **Icon Naming System**: Consistent naming conventions
- ✅ **Icon Sizing Standards**: Standard sizes (16px, 24px, 32px, etc.)
- ✅ **Icon Usage Guidelines**: When/how to use specific icons

**If they have an icon system:**
- Get Figma frame URLs for the complete icon library
- Document icon naming conventions
- Note icon sizing standards
- Plan icon component generation from Figma

**If they don't have an icon system:**
- Document all icons found in component designs
- Suggest creating organized icon library in Figma
- Plan systematic icon extraction and organization

#### 3. **Component Inventory Discovery**
Ask: **"What components do you need built first? Do you have a priority list or roadmap?"**

**Document:**
- ✅ **Priority components** (what's needed immediately)
- ✅ **Component dependencies** (which components depend on others)
- ✅ **Usage frequency** (most-used components first)
- ✅ **Business impact** (revenue-critical components)

#### 4. **Figma Organization Discovery**
Ask: **"How is your Figma file organized? Can you show us the structure and provide access?"**

**What to document:**
- ✅ **Page organization** (Tokens, Components, Documentation, etc.)
- ✅ **Component structure** (Atoms, Molecules, Organisms)
- ✅ **Frame naming conventions**
- ✅ **Variant organization**
- ✅ **Access permissions**

### Asset Discovery Checklist:
- [ ] Design token sources identified and documented
- [ ] Icon system location and scope documented  
- [ ] Component priorities established
- [ ] Figma access and organization understood
- [ ] figma.config.json configured with all frame references
- [ ] LEARNING-LOG.md updated with any gaps or issues

**⚠️ CRITICAL**: Do not proceed to technical setup until asset discovery is complete!

## 🚨 PHASE 1: MANDATORY FIGMA TOKEN EXTRACTION

After asset discovery, design tokens MUST be extracted from Figma.

**Prerequisites:**
1. Figma Design System File with complete token definitions (from discovery)
2. Figma API Access for token extraction
3. Completed asset discovery checklist

**This MUST succeed before any other setup:**
```bash
npm run setup:extract-figma-tokens
npm run validate:tokens-exist
```

## 🏗️ PHASE 2: PROJECT INITIALIZATION

### Step 1: Create Project Structure

```bash
# Initialize project
mkdir pigment-genesis && cd pigment-genesis
git init

# Create ALL directories upfront (including styles/tokens for generated CSS)
mkdir -p src/{_reference,components/{atoms,molecules,organisms},tokens,utils,types,hooks,templates,styles/tokens}
mkdir -p docs scripts tests/{utils,__mocks__} visual-verification/claude-analysis
mkdir -p .storybook swiftui/{Sources/PigmentGenesisUI/{Components,Tokens},Tests}
```

### Step 2: Create Initial package.json

**🚨 CREATE THIS FILE: `package.json`**
```json
{
  "name": "@customink/pigment-genesis",
  "version": "1.0.0",
  "description": "CustomInk's comprehensive design system",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

### Step 3: Create .gitignore

**🚨 CREATE THIS FILE: `.gitignore`**
```
node_modules/
dist/
coverage/
.DS_Store
*.log
storybook-static/
visual-verification/claude-analysis/*.png
.env
.tsup/
*.tsbuildinfo
```

### Step 4: Install ALL Dependencies

```bash
# Install runtime dependencies
npm install --save \
  react@^18.0.0 \
  react-dom@^18.0.0 \
  class-variance-authority@^0.7.0 \
  clsx@^2.1.1 \
  tailwind-merge@^2.3.0 \
  @figma/code-connect@^1.3.3

# Install ALL dev dependencies upfront
npm install --save-dev \
  typescript@^5.4.5 \
  @types/react@^18.2.79 \
  @types/react-dom@^18.2.25 \
  @types/node@^20.12.7 \
  @types/jest@^29.5.7 \
  tsx@^4.19.4 \
  tsup@^8.0.2 \
  tailwindcss@^3.4.3 \
  postcss@^8.4.38 \
  autoprefixer@^10.4.19 \
  @storybook/react@^8.0.8 \
  @storybook/react-vite@^8.0.8 \
  @storybook/addon-essentials@^8.0.8 \
  @storybook/addon-a11y@^8.0.8 \
  @storybook/addon-interactions@^8.0.8 \
  vite@^5.2.10 \
  @vitejs/plugin-react@^4.0.0 \
  jest@^29.7.0 \
  ts-jest@^29.1.0 \
  jest-environment-jsdom@^29.7.0 \
  @testing-library/react@^15.0.2 \
  @testing-library/jest-dom@^6.4.2 \
  jest-axe@^8.0.0 \
  identity-obj-proxy@^3.0.0 \
  puppeteer@^24.9.0 \
  eslint@^8.57.0 \
  @typescript-eslint/eslint-plugin@^7.7.1 \
  @typescript-eslint/parser@^7.7.1 \
  eslint-plugin-react@^7.34.1 \
  eslint-plugin-react-hooks@^4.6.0 \
  eslint-plugin-jsx-a11y@^6.8.0 \
  eslint-plugin-storybook@^0.8.0 \
  prettier@^3.2.5 \
  glob@^10.3.10 \
  axios@^1.5.0 \
  chalk@^5.4.1
```

### Step 5: Create Placeholder Token Files

```bash
# Create placeholder token files to prevent build errors
mkdir -p src/tokens src/styles/tokens
echo '{"colors":{},"spacing":{},"typography":{},"effects":{}}' > src/tokens/figma-tokens.json
echo 'module.exports = { colors: {}, spacing: {} }' > src/tokens/tailwind-tokens.generated.js
echo '/* Placeholder for generated CSS variables */' > src/styles/tokens/css-variables.generated.css
```

This creates:
- `src/tokens/figma-tokens.json` - Placeholder for Figma token extraction
- `src/tokens/tailwind-tokens.generated.js` - Placeholder for Tailwind config
- `src/styles/tokens/css-variables.generated.css` - Placeholder for CSS variables

### Step 6: Update package.json with Complete Scripts

**🚨 UPDATE THIS FILE: `package.json`**
```json
{
  "name": "@customink/pigment-genesis",
  "version": "1.0.0",
  "description": "CustomInk's comprehensive design system",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "setup": "npm run setup:placeholders && npm run setup:validation && npm run setup:reference",
    "setup:placeholders": "node -e \"require('fs').mkdirSync('src/tokens', {recursive:true}); require('fs').writeFileSync('src/tokens/figma-tokens.json', JSON.stringify({colors:{},spacing:{},typography:{},effects:{}},null,2)); require('fs').writeFileSync('src/tokens/tailwind-tokens.generated.js', 'module.exports = { colors: {}, spacing: {} }; // PURE: Only Figma tokens go here'); require('fs').writeFileSync('src/tokens/storybook-tokens.js', \\\"// 🚨 STORYBOOK ONLY - NOT for components\\n// These tokens enable Storybook stories to render properly\\n// Components must ONLY use design tokens from Figma\\n\\nmodule.exports = {\\n  colors: {\\n    // Basic color palette for Storybook stories only\\n    'gray-50': '#f9fafb',\\n    'gray-600': '#4b5563',\\n    'gray-900': '#111827',\\n    'blue-50': '#eff6ff',\\n    'blue-200': '#bfdbfe',\\n    'blue-600': '#2563eb',\\n    'blue-700': '#1d4ed8',\\n    'blue-800': '#1e40af',\\n    'blue-900': '#1e3a8a',\\n    white: '#ffffff',\\n    black: '#000000',\\n  },\\n  spacing: {\\n    // Basic spacing scale for Storybook stories only\\n    '1': '0.25rem',\\n    '2': '0.5rem',\\n    '3': '0.75rem',\\n    '4': '1rem',\\n    '6': '1.5rem',\\n    '8': '2rem',\\n    '12': '3rem',\\n  },\\n  fontSize: {\\n    // Basic font sizes for Storybook stories only\\n    'sm': '0.875rem',\\n    'base': '1rem',\\n    'lg': '1.125rem',\\n    'xl': '1.25rem',\\n    '2xl': '1.5rem',\\n    '4xl': '2.25rem',\\n  },\\n  fontWeight: {\\n    medium: '500',\\n    semibold: '600',\\n    bold: '700',\\n  },\\n  borderRadius: {\\n    lg: '0.5rem',\\n  }\\n};\\\"); require('fs').mkdirSync('src/styles/tokens', {recursive:true}); require('fs').writeFileSync('src/styles/tokens/css-variables.generated.css', '/* Placeholder for generated CSS variables */')\"",
    "setup:extract-figma-tokens": "tsx scripts/extract-figma-tokens.ts",
    "setup:validation": "tsx scripts/setup-validation.ts",
    "setup:reference": "tsx scripts/setup-reference-implementation.ts",
    
    "extract-figma-tokens": "tsx scripts/extract-figma-tokens.ts",
    "update-design-tokens": "npm run extract-figma-tokens && npm run generate-token-files",
    "generate-token-files": "tsx scripts/generate-token-files.ts",
    
    "rebrand": "npm run extract-figma-tokens && npm run validate:tokens && npm run build && npm run build-storybook",
    "rebrand:preview": "tsx scripts/preview-rebrand-changes.ts",
    "rebrand:validate": "tsx scripts/validate-rebrand-capability.ts",
    
    "validate": "npm run validate:architecture && npm run validate:tokens && npm run validate:visual",
    "validate:architecture": "tsx scripts/validate-component-architecture.ts",
    "validate:tokens": "tsx scripts/validate-design-tokens.ts",
    "validate:visual": "tsx scripts/validate-visual-compliance.ts",
    "validate:all": "npm run validate && npm run test && npm run type-check",
    
    "pre-component": "tsx scripts/pre-component.ts",
    "post-component": "npm run validate:all && npm run visual-verify",
    
    "visual-verify": "tsx scripts/visual-verification.ts",
    "claude-visual-verify": "tsx scripts/claude-visual-verify.ts",
    
    "dev": "storybook dev -p 6006",
    "build": "tsup",
    "build-storybook": "storybook build",
    
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:a11y": "jest --testNamePattern=\"accessibility\"",
    
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "lint:fix": "eslint \"src/**/*.{ts,tsx}\" --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    
    "opus:startup": "echo '🏛️ STARTING OPUS ARCHITECT SESSION' && echo '📋 Read CLAUDE-OPUS.md for architect responsibilities' && echo '📝 Checking Learning Log...' && cat LEARNING-LOG.md | head -20 && echo '' && npm run validate:all",
    "sonnet:startup": "echo '🔨 STARTING SONNET IMPLEMENTER SESSION' && echo '📋 Read CLAUDE.md for implementation rules' && echo '🔍 Checking reference pattern...' && echo 'Reference: src/_reference/ReferenceComponent.tsx' && npm run validate:architecture"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "@figma/code-connect": "^1.3.3"
  },
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0",
    "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/customink/pigment-genesis"
  },
  "keywords": [
    "design-system",
    "react",
    "components",
    "tailwind",
    "figma"
  ],
  "author": "CustomInk",
  "license": "MIT",
  "files": [
    "dist",
    "src"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## ✅ Initialization Complete

You should now have:
- Project directory structure created
- Package.json with all scripts configured
- All dependencies installed (including missing ones)
- Placeholder token files created
- .gitignore file created

## 📋 Next Step

👉 **Continue to [STEP-1-CORE-CONFIG.md](./STEP-1-CORE-CONFIG.md)**

## 🚨 Final Step (After All Steps Complete)

After completing all GENESIS-V3 steps, copy the comprehensive documentation to the root:

```bash
# CRITICAL: Copy full instruction files from GENESIS-V3 to root
cp GENESIS-V3/CLAUDE.md ./CLAUDE.md
cp GENESIS-V3/CLAUDE-OPUS.md ./CLAUDE-OPUS.md  
cp GENESIS-V3/README-PROJECT.md ./README.md
```

This ensures Claude has the complete instructions, not minimal stubs!