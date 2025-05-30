# Pigment-Genesis Design System

A comprehensive, rebrand-ready design system built for CustomInk using React, TypeScript, Tailwind CSS, and Storybook. This system leverages Figma's MCP integration to create a fully automated design-to-code workflow with instant rebrand capability.

## 🎯 What Makes Pigment-Genesis Unique

- **100% Figma-Driven**: Every pixel, color, and spacing value comes directly from Figma designs
- **Instant Rebrand Capability**: Change design tokens in Figma, and the entire codebase updates automatically
- **Zero Hardcoded Values**: All visual properties flow through design tokens
- **Pixel-Perfect Accuracy**: Automated visual verification ensures 95%+ fidelity to designs
- **Architecture-First**: Enforced patterns ensure consistency across 100+ components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Figma account with MCP integration
- Sharp Sans font installed (contact CustomInk for access)

### Installation

```bash
# Clone the repository
git clone https://github.com/customink/pigment-genesis.git
cd pigment-genesis

# Install dependencies
npm install

# Run setup scripts
npm run setup

# Start development
npm run dev
```

### Key Commands

```bash
# Development
npm run dev                    # Start Storybook development server
npm run build                  # Build the component library
npm run test                   # Run all tests

# Design Tokens
npm run extract-figma-tokens   # Extract latest tokens from Figma
npm run validate-tokens        # Validate token completeness
npm run rebrand:preview        # Preview rebrand changes

# Validation
npm run validate:all           # Run all validation checks
npm run validate:architecture  # Check architectural compliance
npm run visual-verify          # Run visual regression tests

# Component Development
npm run claude-visual-verify ComponentName  # Capture screenshots for analysis
```

## 📁 Project Structure

```
pigment-genesis/
├── src/
│   ├── _reference/          # Canonical pattern reference
│   ├── components/          # Component library
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Composed components
│   │   └── organisms/      # Complex components
│   ├── tokens/             # Design tokens (auto-generated)
│   ├── utils/              # Shared utilities
│   └── hooks/              # Shared React hooks
├── scripts/                # Build and validation scripts
├── docs/                   # Documentation
├── visual-verification/    # Screenshot comparisons
└── CLAUDE.md              # AI instructions (critical)
```

## 🏗️ Architecture

### Component Pattern (CVA + Tailwind)

Every component follows this mandatory pattern:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/classNames';

const buttonVariants = cva(
  ['base-classes'],
  {
    variants: {
      variant: {
        primary: ['token-based-classes'],
        secondary: ['token-based-classes']
      }
    }
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // Component-specific props
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
```

### Design Tokens

All visual properties come from Figma-extracted tokens:

- **Colors**: Semantic color system (neutral, interactive, status)
- **Spacing**: Consistent spacing scale
- **Typography**: Font sizes, weights, and line heights
- **Effects**: Shadows, borders, and transitions

## 👥 Working with Claude

This project uses two Claude models with distinct roles:

### Claude Sonnet - The Implementer
- Builds components following established patterns
- Documents discoveries in LEARNING-LOG.md
- Follows instructions in CLAUDE.md

To work with Sonnet:
```bash
npm run sonnet:startup
```

Then say: "I'm ready to add a new component"

### Claude Opus - The Architect
- Makes architectural decisions
- Reviews and approves pattern changes
- Updates system documentation

To work with Opus:
```bash
npm run opus:startup
```

## 🎨 Adding Components

### The Workflow

1. **Design First**: Components MUST have Figma designs
2. **Token Extraction**: Extract all design specifications
3. **Implementation**: Build following the established pattern
4. **Validation**: Pass all architectural and visual checks
5. **Documentation**: Complete Storybook stories and tests

### Example Session

```
You: I'm ready to add a new component
Claude: I'll help you add a new component. Which component would you like to work on, and could you provide the Figma frame links for all its states and variations?
You: [Provides Figma links]
Claude: [Extracts specifications and builds component]
```

## 📊 Quality Standards

Every component must meet:

- ✅ 100% Architectural compliance (CVA + Tailwind pattern)
- ✅ 100% Design token usage (no hardcoded values)
- ✅ 95%+ Visual accuracy (pixel-perfect to Figma)
- ✅ 100% Test coverage (unit, integration, accessibility)
- ✅ 100% Accessibility compliance (WCAG AAA target)

## 🔄 Rebranding

To rebrand the entire system:

1. Update design tokens in Figma
2. Run token extraction:
   ```bash
   npm run extract-figma-tokens
   npm run rebrand
   ```
3. All components automatically reflect new brand

## 📚 Documentation

- **[Component Standards](./docs/component-standards.md)** - Development guidelines
- **[Architecture Pattern](./docs/component-architecture-pattern.md)** - Technical patterns
- **[Figma Workflow](./docs/figma-workflow.md)** - Design integration
- **[Testing Guide](./docs/testing-guide.md)** - Testing strategies
- **[Visual Verification](./docs/visual-verification-guide.md)** - Quality assurance

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

### Quick Start for Contributors

1. Read CLAUDE.md to understand the system
2. Review existing components for patterns
3. Always start with Figma designs
4. Follow the CVA + Tailwind pattern exactly
5. Document discoveries in LEARNING-LOG.md

## 📈 Metrics

Current system status:
- Components: 6 atoms, 0 molecules, 0 organisms
- Architectural Compliance: 100%
- Test Coverage: 100%
- Visual Accuracy: >95%

## 🚨 Important Notes

- **Never create components without Figma designs**
- **Never use inline styles or hardcoded values**
- **Always follow the established patterns**
- **Quality over speed - always**

## 📝 License

MIT © CustomInk

---

Built with ❤️ for perfect design-to-code fidelity