# 🎯 GENESIS V3 - COMPLETE COMPONENT TEMPLATE

## 📁 Required Component Structure

Every component in the Pigment-Genesis design system MUST follow this exact folder structure:

```
src/components/[atomic-level]/[ComponentName]/
├── ComponentName.tsx                    # Main component file
├── ComponentName.figmaframes.md         # Figma documentation
├── ComponentName.stories.tsx            # Storybook stories
├── ComponentName.test.tsx               # Component tests
├── ComponentName.tokens.md              # Token documentation
├── index.ts                            # Component exports
└── ComponentName.css                   # (Optional) Component-specific styles
```

## 📋 File-by-File Requirements

### 1. ComponentName.tsx
```typescript
// 🔑 MANDATORY STRUCTURE - NO EXCEPTIONS
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/classNames';

// Component documentation header
const componentVariants = cva(
  // Base styles - ONLY design token classes
  [],
  {
    variants: {
      // All variants using token classes
    },
    defaultVariants: {
      // Default values
    }
  }
);

export interface ComponentNameProps 
  extends React.HTMLAttributes<HTMLElement>,
          VariantProps<typeof componentVariants> {
  // Documented props
}

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ /* props */ }, ref) => {
    // Implementation using ONLY token classes
  }
);

ComponentName.displayName = 'ComponentName';
export default ComponentName;
```

### 2. ComponentName.figmaframes.md
Use the EXACT format from ReferenceComponent.figmaframes.md:
- Component Overview section
- Figma Frame Index with Node IDs
- Extracted Specifications for each frame
- Design Tokens Used
- State Specifications table
- Variant Matrix table
- Usage Guidelines (Do's and Don'ts)
- Ambiguities & Clarifications
- Token Mapping code block
- Implementation Checklist

### 3. ComponentName.stories.tsx
Follow the EXACT structure from ReferenceComponent.stories.tsx:
- Complete Meta configuration
- Comprehensive component documentation
- Individual variant stories
- Size variation story
- States demonstration story
- Figma examples replication
- Accessibility demonstration
- Playground story

### 4. ComponentName.test.tsx
Match the test organization from ReferenceComponent.test.tsx:
- Rendering & Basic Props
- Variant Behavior
- Interactive States
- Accessibility (with jest-axe)
- Edge Cases
- Design System Compliance
- Snapshot Tests

### 5. ComponentName.tokens.md
Document all tokens following ReferenceComponent.tokens.md:
- Color Tokens tables
- Spacing Tokens tables
- Typography Tokens tables
- Interactive State Tokens
- Token Usage Guidelines
- Token References

### 6. index.ts
Standard export pattern:
```typescript
export { ComponentName } from './ComponentName';
export { default } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## 🚀 Component Creation Workflow

### Step 1: Pre-Component Validation
```bash
npm run pre-component ComponentName atoms|molecules|organisms
```
**This is MANDATORY** - Do not proceed without running this command.

### Step 2: Figma Frame Capture
1. Get all Figma frame URLs from the user
2. IMMEDIATELY capture Node IDs using MCP tools
3. Create ComponentName.figmaframes.md following the template
4. Extract ALL specifications (no assumptions)

### Step 3: Component Implementation
1. Create ComponentName.tsx following CVA pattern
2. Use ONLY design token classes
3. NO hardcoded colors/values
4. NO inline styles
5. NO direct token imports

### Step 4: Story Creation
1. Create stories in the EXACT format shown
2. Cover ALL variants and states
3. Include Figma example replications
4. Add comprehensive documentation

### Step 5: Test Implementation
1. Write tests following the template structure
2. Include accessibility tests
3. Test all variants and edge cases
4. Verify design token compliance

### Step 6: Documentation
1. Create ComponentName.tokens.md
2. Document all design tokens used
3. Add usage guidelines
4. Include token mapping

### Step 7: Validation
```bash
npm run validate:architecture
npm run build
npx tsc --noEmit
npm run claude-visual-verify ComponentName
```
ALL commands must pass before component is complete.

## ⚠️ Common Mistakes to Avoid

### ❌ NEVER DO THIS:
```typescript
// Hardcoded colors
className="bg-[#1976d2] text-[#ffffff]"
className="bg-[rgba(0,0,0,0.86)]"

// Inline styles
style={{ backgroundColor: '#1976d2' }}

// Direct token imports
import { colors } from '../../../tokens/colors';
style={{ color: colors.primary[500] }}

// Arbitrary values
className="w-[327px] h-[42px]"

// Missing documentation
// No JSDoc comments
// No Figma references
```

### ✅ ALWAYS DO THIS:
```typescript
// Design token classes
className="bg-interactive-bg-bold text-interactive-text-on-fill"

// CVA variants
className={cn(componentVariants({ variant, size }))}

// Standard spacing
className="px-4 py-2"

// Complete documentation
/**
 * Component description
 * @example usage
 */
```

## 📊 Quality Checklist

Before considering a component complete:

- [ ] Pre-component validation passed
- [ ] All files follow exact template structure
- [ ] 100% design token usage (no hardcoded values)
- [ ] Figma frames documented with Node IDs
- [ ] Stories cover all variants and states
- [ ] Tests achieve >90% coverage
- [ ] Accessibility tests pass
- [ ] Architecture validation shows 100%
- [ ] Build succeeds without errors
- [ ] TypeScript has no errors
- [ ] Visual verification matches Figma

## 🔗 Reference Implementation

The complete reference implementation is in:
```
src/_reference/
├── ReferenceComponent.tsx
├── ReferenceComponent.figmaframes.md
├── ReferenceComponent.stories.tsx
├── ReferenceComponent.test.tsx
├── ReferenceComponent.tokens.md
├── index.ts
└── README.md
```

**ALWAYS refer to these files when creating new components.**