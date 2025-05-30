# 🎨 REFERENCE COMPONENT - FIGMA FRAMES DOCUMENTATION

## 📋 Component Overview
**Component Name**: ReferenceComponent  
**Atomic Level**: Atom  
**Figma File**: [Design System Components]  
**Last Updated**: [Date]

## 🖼️ Figma Frame Index

### Frame 1: Component Specifications
**Node ID**: `[Node ID from Figma]`  
**Frame Name**: "ReferenceComponent/Specs"  
**Purpose**: Core design specifications and measurements

#### 📐 Extracted Specifications:
- **Dimensions**: 
  - Small: 64px × 32px (min-width × height)
  - Medium: 80px × 40px
  - Large: 96px × 48px
- **Border Radius**: 6px
- **Padding**:
  - Small: 12px horizontal, 6px vertical
  - Medium: 16px horizontal, 8px vertical  
  - Large: 24px horizontal, 12px vertical

#### 🎨 Design Tokens Used:
```
Colors:
- Primary Background: --color-interactive-bg-bold (#1976d2)
- Primary Text: --color-interactive-text-on-fill (#ffffff)
- Secondary Border: --color-interactive-border-bold (#1976d2)
- Disabled Background: --color-interactive-border-disabled (#e0e0e0)

Typography:
- Font Family: Sharp Sans Semibold
- Small: 14px/20px
- Medium: 14px/20px
- Large: 16px/24px
```

### Frame 2: Component States
**Node ID**: `[Node ID from Figma]`  
**Frame Name**: "ReferenceComponent/States"  
**Purpose**: All interactive states

#### 🔄 State Specifications:
| State | Background | Text | Border | Shadow |
|-------|------------|------|--------|--------|
| Default | interactive-bg-bold | interactive-text-on-fill | none | none |
| Hover | interactive-bg-bold-hover | interactive-text-on-fill | none | 0 2px 4px rgba(0,0,0,0.1) |
| Active | interactive-bg-bold-pressed | interactive-text-on-fill | none | none |
| Focus | interactive-bg-bold | interactive-text-on-fill | 2px ring primary-500 | none |
| Disabled | interactive-border-disabled | interactive-text-disabled | none | none |

### Frame 3: Component Variants
**Node ID**: `[Node ID from Figma]`  
**Frame Name**: "ReferenceComponent/Variants"  
**Purpose**: All component variations

#### 🔀 Variant Matrix:
| Variant | Size | Description | Use Case |
|---------|------|-------------|----------|
| Primary/Small | 32px | Primary action, compact | Toolbars, dense UI |
| Primary/Medium | 40px | Primary action, default | General use |
| Primary/Large | 48px | Primary action, prominent | Hero sections |
| Secondary/Small | 32px | Secondary action, compact | Supporting actions |
| Secondary/Medium | 40px | Secondary action, default | Alternative actions |
| Secondary/Large | 48px | Secondary action, prominent | Less emphasis |
| Destructive/All | All | Dangerous actions | Delete, remove |

### Frame 4: Usage Guidelines
**Node ID**: `[Node ID from Figma]`  
**Frame Name**: "ReferenceComponent/Guidelines"  
**Purpose**: Do's and don'ts for implementation

#### ✅ Do's:
- Use primary variant for main call-to-action
- Maintain 16px spacing between grouped components
- Use large size for prominent placements
- Ensure sufficient color contrast

#### ❌ Don'ts:
- Don't use more than one primary component per section
- Don't manually override heights
- Don't place components too close together (<8px)
- Don't mix sizes in the same group

### Frame 5: Examples & Patterns
**Node ID**: `[Node ID from Figma]`  
**Frame Name**: "ReferenceComponent/Examples"  
**Purpose**: Real-world usage examples

#### 📚 Common Patterns:
1. **Form Actions**: Primary "Submit" + Secondary "Cancel"
2. **Modal Footer**: Primary "Save" + Secondary "Close"
3. **Toolbar**: Multiple secondary actions grouped
4. **Card Actions**: Text-only variant for subtle actions

## 🔍 Ambiguities & Clarifications

### Resolved Questions:
1. **Q**: What happens with very long text?
   **A**: Text truncates with ellipsis, tooltip shows full text

2. **Q**: How do icons integrate?
   **A**: Icons are 20px × 20px with 8px gap from text

### Design Decisions:
- Minimum width enforced to prevent awkward proportions
- Focus ring uses 2px offset for better visibility
- Disabled state reduces opacity to 0.6

## 📊 Token Mapping

```typescript
// Component-specific token mappings
const tokenMap = {
  // Colors
  'interactive-bg-bold': 'var(--color-primary-500)',
  'interactive-bg-bold-hover': 'var(--color-primary-600)',
  'interactive-bg-bold-pressed': 'var(--color-primary-700)',
  'interactive-text-on-fill': 'var(--color-neutral-white)',
  'interactive-text-default': 'var(--color-neutral-900)',
  'interactive-border-bold': 'var(--color-primary-500)',
  'interactive-border-disabled': 'var(--color-neutral-300)',
  'interactive-text-disabled': 'var(--color-neutral-500)',
  
  // Spacing
  'spacing-xs': '4px',
  'spacing-sm': '8px',
  'spacing-md': '16px',
  'spacing-lg': '24px',
  
  // Typography
  'font-weight-semibold': '600',
  'line-height-tight': '1.25',
  'line-height-normal': '1.5'
};
```

## 🚀 Implementation Checklist

- [ ] All color values use design tokens
- [ ] All spacing values use standard scale
- [ ] Typography follows design system
- [ ] States implemented with proper tokens
- [ ] Accessibility requirements met
- [ ] Visual regression tests added
- [ ] Storybook stories cover all variants
- [ ] Documentation complete