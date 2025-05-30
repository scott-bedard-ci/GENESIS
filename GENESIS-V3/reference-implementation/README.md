# 🔑 Reference Implementation Directory - COMPLETE Component Template

## ⚠️ CRITICAL: This is NOT a Production Component

This directory contains the **COMPLETE canonical reference implementation** that ALL components in the Pigment-Genesis design system MUST follow. The ReferenceComponent exists solely to demonstrate the correct patterns for EVERY aspect of component development.

## Purpose

This folder serves as:
1. **The Complete Template** for ALL component files and structure
2. **The Documentation Standard** for Figma frames and design tokens
3. **The Story Pattern** for Storybook organization
4. **The Test Structure** for comprehensive coverage
5. **The Single Source of Truth** that ensures total consistency

## 📁 Complete Directory Structure

```
_reference/
├── ReferenceComponent.tsx          # Component with perfect CVA + token architecture
├── ReferenceComponent.figmaframes.md # Standardized Figma documentation format
├── ReferenceComponent.stories.tsx   # Complete story structure and patterns  
├── ReferenceComponent.test.tsx      # Comprehensive test organization
├── ReferenceComponent.tokens.md     # Design token documentation
├── index.ts                        # Proper export patterns
└── README.md                       # This file
```

### ReferenceComponent.tsx
- Demonstrates the MANDATORY CVA + Tailwind pattern
- Shows proper TypeScript interface structure
- Illustrates correct forwardRef usage
- Examples all required design token classes
- Includes comprehensive inline documentation

### ReferenceComponent.figmaframes.md
- Shows EXACT format for documenting Figma frames
- Demonstrates Node ID capture and storage
- Includes specification extraction tables
- Shows token mapping documentation
- Contains implementation checklist

### ReferenceComponent.stories.tsx
- Complete Storybook meta configuration
- Individual story patterns for variants
- Render functions for complex examples
- Documentation standards
- Accessibility demonstrations

### ReferenceComponent.test.tsx
- Organized test structure by category
- Comprehensive coverage patterns
- Accessibility testing with jest-axe
- Design system compliance tests
- Edge case handling

### ReferenceComponent.tokens.md
- Complete token documentation format
- Color, spacing, typography tables
- Interactive state documentation
- Usage guidelines
- Token references

### index.ts
- Proper export patterns
- Named and default exports
- Type exports

## Rules for This Directory

### ❌ NEVER:
- Use ReferenceComponent in production code
- Import ReferenceComponent into other components
- Modify the pattern (only Opus can change this)
- Add additional components to this directory
- Create variations or alternatives

### ✅ ALWAYS:
- Refer to this when building new components
- Copy the pattern exactly (adapt for your component's needs)
- Use this to resolve architectural questions
- Check your implementation against this reference

## The Mandatory Pattern

Every component MUST have:

1. **CVA Import and Usage**
   ```typescript
   import { cva, type VariantProps } from 'class-variance-authority';
   const componentVariants = cva([...], { variants: {...} });
   ```

2. **Design Token Classes Only**
   - NO hardcoded colors (`#hex`, `rgb()`)
   - NO arbitrary values (`p-[12px]`)
   - NO Tailwind color utilities (`bg-blue-500`)
   - ONLY token classes (`bg-interactive-bg-bold`)

3. **TypeScript with VariantProps**
   ```typescript
   interface ComponentProps extends VariantProps<typeof componentVariants> {}
   ```

4. **ForwardRef Implementation**
   ```typescript
   export const Component = forwardRef<HTMLElement, ComponentProps>(...);
   ```

## Validation

This reference implementation:
- Scores 100% on architectural validation
- Contains zero forbidden patterns
- Uses only design token classes
- Follows all TypeScript best practices
- Includes proper display name

Run validation to confirm:
```bash
npm run validate:architecture
```

The validation script specifically checks that ReferenceComponent.tsx remains 100% compliant as the canonical pattern.

## For New Developers

When creating your first component:

1. **Read** ReferenceComponent.tsx completely
2. **Understand** each section and why it exists
3. **Copy** the pattern structure exactly
4. **Adapt** only the component-specific parts
5. **Validate** your component matches the pattern

## Questions?

If the pattern seems limiting or doesn't cover your use case:
1. First, reconsider your approach - the pattern is comprehensive
2. Document the issue in LEARNING-LOG.md
3. Continue following the pattern while awaiting architectural review
4. NEVER deviate from the pattern on your own

Remember: **Consistency is more important than any individual optimization.**