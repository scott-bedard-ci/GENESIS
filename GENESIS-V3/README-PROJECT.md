# Pigment-Genesis Design System

A comprehensive, high-quality design system for CustomInk built with React, TypeScript, Tailwind CSS, and Storybook.

## 🎯 Core Philosophy: Quality Over Speed

**Perfection is the only acceptable standard.** This design system prioritizes flawless implementation over rapid development. Every component must meet 100% of our quality standards before inclusion.

## ✨ Key Features

- **🎨 Figma-First Development**: All components built directly from Figma designs
- **🔄 Instant Rebrand Capability**: Design token changes propagate automatically
- **♿ WCAG AAA Accessibility**: Comprehensive accessibility compliance
- **📱 Mobile-First Responsive**: Seamless experience across all devices  
- **🧪 100% Test Coverage**: Unit, integration, and visual regression tests
- **📚 Comprehensive Documentation**: Detailed Storybook docs with examples
- **🏗️ Atomic Design**: Scalable component hierarchy (Atoms → Organisms)
- **⚡ Performance Optimized**: Fast rendering and minimal bundle size

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- **Sharp Sans Medium font** (required for accurate typography)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pigment-genesis

# Install dependencies
npm install

# Install Sharp Sans font
# Download from CustomInk's design assets and install system-wide

# Validate setup
npm run validate:all

# Start development
npm run dev
```

### Using the Design System

```tsx
import { Button } from '@customink/pigment-genesis';

function App() {
  return (
    <Button variant="primary" size="large">
      Click me
    </Button>
  );
}
```

## 🏗️ Architecture

### Component Structure

Every component follows our strict architectural pattern:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/classNames';

const componentVariants = cva(
  ['bg-neutral-bg-primary', 'text-neutral-text-primary'],
  {
    variants: {
      variant: {
        primary: ['bg-interactive-bg-bold', 'text-interactive-text-on-fill'],
        secondary: ['bg-neutral-bg-primary', 'border-interactive-border-bold']
      }
    }
  }
);

interface ComponentProps 
  extends React.HTMLAttributes<HTMLElement>,
          VariantProps<typeof componentVariants> {
  // Additional props
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
```

### Key Principles

1. **CVA + Tailwind**: Class Variance Authority with design token classes
2. **No Inline Styles**: All styling through Tailwind CSS classes
3. **Design Token Classes**: `bg-neutral-bg-primary`, `text-primary-500`
4. **forwardRef**: All components support ref forwarding
5. **TypeScript First**: Comprehensive type safety

## 🎨 Design Token System

Our design system uses a comprehensive token system that enables instant rebranding:

### Color Tokens
- **Neutral**: `bg-neutral-bg-primary`, `text-neutral-text-primary`
- **Interactive**: `bg-interactive-bg-bold`, `text-interactive-text-on-fill`
- **Semantic**: `bg-error-500`, `text-success-500`

### Spacing Tokens
- Standard Tailwind classes: `px-4`, `py-2`, `gap-2`, `mb-1`

### Typography Tokens
- Font sizes: `text-[14px]`, `text-[16px]`
- Font weights: `font-medium`, `font-bold`
- Line heights: `leading-[1.25]`, `leading-[1.5]`

## 🛠️ Development Workflow

### 1. Component Development

```bash
# I'm ready to add a new component
# (Provide Figma frame links)

# Validate tokens are ready
npm run validate:tokens

# Extract design specifications from Figma
# Build component following ReferenceComponent.tsx

# Visual verification
npm run claude-visual-verify ComponentName

# Run all validations
npm run validate:all
```

### 2. Quality Standards

Every component must achieve:
- ✅ **100% Figma Fidelity**: Pixel-perfect implementation
- ✅ **100% Design Token Usage**: No hardcoded values
- ✅ **100% Test Coverage**: All behaviors tested
- ✅ **100% Accessibility**: WCAG compliance
- ✅ **95%+ Visual Match**: Automated visual verification

### 3. Testing

```bash
# Run all tests
npm test

# Visual regression tests
npm run test:visual

# Accessibility tests
npm run test:a11y

# Performance tests
npm run test:performance
```

## 📚 Documentation

### Storybook

Our comprehensive component documentation includes:

- **Usage Examples**: Code snippets and live examples
- **Design Guidelines**: Proper implementation patterns
- **Do's and Don'ts**: Common mistakes to avoid
- **Interactive Controls**: Test all component props
- **Accessibility Info**: ARIA labels and keyboard navigation

```bash
npm run storybook
```

### Component Documentation

Each component includes:
- **API Documentation**: Props, types, and interfaces
- **Usage Guidelines**: When and how to use
- **Related Components**: Cross-references
- **Design Specifications**: Extracted from Figma

## 🔧 Available Scripts

### Development
```bash
npm run dev              # Start Storybook development server
npm run build            # Build production library
npm run test             # Run all tests
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
```

### Design Tokens
```bash
npm run extract-figma-tokens     # Extract tokens from Figma
npm run update-design-tokens     # Regenerate all token files
npm run rebrand:preview          # Preview rebrand changes
```

### Validation & Quality
```bash
npm run validate:all             # Run all validations
npm run validate:tokens          # Validate design tokens
npm run validate:architecture    # Check architectural compliance
npm run validate:visual          # Visual compliance check
```

### Visual Verification
```bash
npm run visual-verify            # Full visual verification system
npm run claude-visual-verify     # Capture screenshots for analysis
```

## 🎭 Two-Model Development System

We use specialized Claude models for different roles:

### Claude Opus 4 - The Architect
- **Role**: Makes architectural decisions and maintains quality standards
- **Responsibilities**: Pattern approval, critical issue review, version management
- **When to use**: Initial setup, breaking changes, architectural questions

### Claude Sonnet 4 - The Implementer  
- **Role**: Builds components following established patterns
- **Responsibilities**: Component development, testing, documentation
- **When to use**: Daily development, component building, bug fixes

## 🔄 Rebrand Capability

The design system supports instant rebranding through our token system:

```bash
# Preview rebrand changes
npm run rebrand:preview

# Apply new brand tokens from Figma
npm run extract-figma-tokens
npm run update-design-tokens
```

All components automatically inherit the new brand without code changes.

## 📊 Quality Metrics

We maintain strict quality standards:

- **Architectural Compliance**: 100%
- **Token Coverage**: 100% 
- **Test Coverage**: 100%
- **Visual Accuracy**: >95%
- **Accessibility Score**: 100%
- **Performance Budget**: <100ms render time

## 🚨 Critical Requirements

### Never:
- ❌ Create components without Figma designs
- ❌ Use inline styles (`style={{}}`)
- ❌ Import tokens directly for styling
- ❌ Hardcode any design values
- ❌ Skip validation steps

### Always:
- ✅ Follow ReferenceComponent.tsx pattern
- ✅ Use CVA + Tailwind architecture
- ✅ Extract all values from Figma
- ✅ Document discoveries in LEARNING-LOG.md
- ✅ Achieve 95%+ visual accuracy

## 📁 Project Structure

```
pigment-genesis/
├── src/
│   ├── _reference/              # Canonical implementation patterns
│   │   └── ReferenceComponent.tsx   # Mandatory architectural pattern
│   ├── components/              # Component library
│   │   ├── atoms/              # Basic building blocks
│   │   ├── molecules/          # Composed components  
│   │   └── organisms/          # Complex components
│   ├── tokens/                 # Design tokens (auto-generated)
│   ├── utils/                  # Shared utilities
│   ├── hooks/                  # Shared React hooks
│   └── types/                  # TypeScript type definitions
├── scripts/                    # Build and validation scripts
├── docs/                       # Additional documentation
├── tests/                      # Test utilities and mocks
├── visual-verification/        # Screenshot comparisons
├── CLAUDE.md                   # Implementer instructions
├── CLAUDE-OPUS.md              # Architect instructions
├── LEARNING-LOG.md             # Development discoveries
├── VERSION-HISTORY.md          # Architectural decisions
└── CONTRIBUTING.md             # Team contribution guide
```

## 🤝 Contributing

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) guide before contributing. Key points:

1. **Quality First**: Perfect implementation over speed
2. **Follow Patterns**: Use established architectural patterns
3. **Figma Required**: No components without design specifications
4. **Document Everything**: Update LEARNING-LOG.md with discoveries
5. **Test Thoroughly**: Achieve 100% coverage

## 📄 License

This design system is proprietary to CustomInk and not licensed for external use.

## 📞 Support

For questions, issues, or architectural discussions:

- **Technical Issues**: Document in LEARNING-LOG.md
- **Architectural Questions**: Involve Claude Opus 4
- **Component Requests**: Provide Figma design specifications

---

**Built with ❤️ by the CustomInk Design System Team**

*Remember: Perfection is the only acceptable standard. Every component represents our brand.*