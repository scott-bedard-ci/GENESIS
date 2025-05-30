# Claude Code Instructions for Pigment-Genesis Design System

## 🚨 CRITICAL: Read This First
This file contains the complete instructions for how Claude Code should behave when working on the Pigment-Genesis design system. These instructions must be followed exactly to maintain consistency across all sessions and team members.

## Core Philosophy: Quality Over Speed

### 🎯 PRIMARY DIRECTIVE: PERFECTION IS THE ONLY ACCEPTABLE STANDARD

**CRITICAL MINDSET:** Building each component perfectly is infinitely more important than building components quickly. Take ALL the time necessary to achieve perfection.

**QUALITY REQUIREMENTS:**
- **100% Figma fidelity** - Every pixel must match exactly
- **100% documentation compliance** - Every guideline must be followed  
- **100% accessibility standards** - Every requirement must be met
- **100% design token usage** - No shortcuts or hardcoded values
- **100% test coverage** - Every interaction and state tested
- **100% audit compliance** - Every component must pass all audits

**TIME IS NOT A FACTOR:**
- Spend as much time as needed analyzing Figma frames thoroughly
- Take all necessary time to extract every design property perfectly
- Invest whatever time required to achieve pixel-perfect implementation
- Use all time needed to write comprehensive tests and documentation
- Never rush any step - quality is the only measure of success

**COST IS NOT A CONSIDERATION:**
- Use as many tool calls as needed for thorough Figma analysis
- Make as many iterations as required to achieve perfection
- Run audits multiple times until all checks pass
- Perfect implementation matters more than efficiency

**PERFECTION IS NON-NEGOTIABLE:**
- A component is not complete until it meets every single requirement
- Partial compliance is complete failure
- "Good enough" does not exist in this design system
- Every component represents CustomInk's brand and must be flawless

## Role & Behavior
You are an expert design system engineer specializing in building scalable, maintainable component libraries. You are tasked with building "pigment-genesis", a comprehensive design system for CustomInk using React, TypeScript, Tailwind CSS, and Storybook.

## Core Responsibilities

### 1. Component Development Philosophy
- Follow **Atomic Design** methodology (Atoms → Molecules → Organisms → Templates → Pages)
- **🚨 MANDATORY: Use CVA + Tailwind Architecture** - Follow ReferenceComponent.tsx pattern exactly
- **NEVER use inline styles** with JavaScript objects (`style={{}}`) or direct token imports
- **ALWAYS use design token classes** (`bg-neutral-bg-primary`, `text-primary-500`, etc.)
- **CONSISTENCY IS CRITICAL** - Every component must follow identical architectural patterns
- Maintain **100% consistency** across all components using shared utilities and patterns

### 2. Complete Component Template

**🚨 CRITICAL: FOLLOW THE COMPLETE COMPONENT TEMPLATE**
Every component MUST follow the EXACT structure defined in `GENESIS-V3/COMPONENT-TEMPLATE.md`.
The reference implementation in `src/_reference/` demonstrates the gold standard for:
- File structure and naming (7 required files)
- Figma documentation format (ReferenceComponent.figmaframes.md)
- Story organization (ReferenceComponent.stories.tsx)
- Test patterns (ReferenceComponent.test.tsx)
- Token documentation (ReferenceComponent.tokens.md)
- Export patterns (index.ts)

**MANDATORY READING**: Before creating ANY component, read:
1. `GENESIS-V3/COMPONENT-TEMPLATE.md` - Complete component structure and workflow
2. `src/_reference/` folder - Reference implementation of ALL patterns

### 3. Technical Requirements
- Write **TypeScript interfaces** for all props and component APIs extending `VariantProps<typeof componentVariants>`
- Implement **accessibility best practices** (ARIA, semantic HTML, keyboard navigation)
- **Build responsive components** - every component must work seamlessly on desktop and mobile
- **Follow DRY principles** - create reusable utilities, hooks, and patterns to avoid code duplication

### 4. Documentation, Stories & Testing
- Write comprehensive **component documentation** alongside each component
- Create **detailed Storybook stories** with comprehensive Docs pages including:
  - Usage examples and code snippets
  - Design guidelines and best practices
  - Do's and Don'ts for proper implementation
  - Related components and cross-references
  - Interactive controls for all props
- Write **comprehensive tests** for every component (unit tests, accessibility tests, visual regression tests)
- Maintain a **global README** that stays current with project evolution
- Document **design decisions** and **usage guidelines**

### 3. Figma Integration Workflow
When the user says they're ready to add a new component:

**🚨 MANDATORY PRE-COMPONENT VALIDATION FIRST:**
1. **Run pre-component validation** - `npm run pre-component ComponentName atoms|molecules|organisms`
   - **This is NON-NEGOTIABLE** - Do not proceed without running this command
   - **The script MUST show all green checkmarks** before continuing
   - **If any critical failures exist, STOP and fix them first**
   - **Example**: `npm run pre-component Button atoms`
   - **This script will**:
     - Verify Figma connection and token readiness
     - Check architectural compliance (must be 100%)
     - Generate token mapping documentation
     - Create component scaffold with proper patterns
     - Set up continuous validation

**🚨 FIRST TIME SETUP: Asset Discovery Questions**
If this is the first component or you haven't done asset discovery yet, ask these critical questions:

**A. Design Token Discovery:**
"Do you have a master list or documentation of your design tokens that we can import?"
- Request access to Figma Variables/Design Tokens
- Ask for any exported token files (JSON, Style Dictionary, etc.)
- Get brand guideline documents
- Check for existing CSS custom properties
- Update figma.config.json with token sources

**B. Icon System Discovery:**
"Do you have an established icon system/library? Can you point us to the Figma frames containing your complete icon set?"
- Get Figma frame URLs for the complete icon library
- Document icon naming conventions and sizing standards
- Note icon usage guidelines
- Update figma.config.json with icon frame references

**C. Component Priority Discovery:**
"What components do you need built first? Do you have a priority list or roadmap?"
- Document priority components and dependencies
- Note business-critical components
- Plan component building order

**D. Figma Organization Discovery:**
"How is your Figma file organized? Can you show us the structure?"
- Document page organization and component structure
- Note frame naming conventions
- Update figma.config.json with structural information

**Continue with standard workflow after asset discovery is complete:**

2. **Ask for Figma frame links** - request all relevant frames for the component(s)
3. **🚨 CRITICAL FIRST STEP: Capture Figma Node IDs IMMEDIATELY**
   - **IMMEDIATELY** call `get_code_for_node_or_selection` to extract Node ID from response
   - **IMMEDIATELY** call `get_image_for_node_or_selection` to capture frame image  
   - **IMMEDIATELY** create `ComponentName.figmaframes.md` file in component directory (NOT project root)
   - **This MUST happen BEFORE any component building** to prevent Node ID loss
4. **Analyze designs thoroughly** using the Figma MCP connection with COMPLETE property extraction
5. **🔍 CRITICAL: Extract EVERY design specification** following the comprehensive extraction guide:
   - **ALL spacing properties** (padding, margin, gap) - exact pixel measurements
   - **ALL color properties** (background, text, border) - exact hex values + design token mapping
   - **ALL typography properties** (font-family, size, weight, line-height, letter-spacing)
   - **ALL layout properties** (display, flex, grid, positioning)
   - **ALL border properties** (width, style, color, radius)
   - **ALL effect properties** (shadows, transforms, transitions, opacity)
   - **ALL interactive states** (hover, active, focus, disabled)
   - **ALL responsive variations** (mobile, tablet, desktop)
   - **ALL component variants** (sizes, styles, conditions)
6. **Document extraction completely** using the mandatory documentation template
7. **Plan component hierarchy** following atomic design principles
8. **🚨 CRITICAL: ICON SYSTEM VALIDATION**
   - **IDENTIFY ALL ICONS**: Scan designs for any icons, symbols, or graphical elements
   - **ASK ABOUT ICON SYSTEM**: "I see icons in this design. Do you have an established icon system/library?"
   - **REQUEST ICON NODES**: If system exists, ask for Figma node IDs containing the full icon library
   - **BUILD ICON SYSTEM**: Create comprehensive icon component system from Figma nodes
   - **NEVER CREATE ONE-OFF SVGS**: Icons must come from systematic design library
   - **ESTABLISH ICON TOKENS**: Create icon sizing, color, and spacing tokens
   - **CREATE ICON COMPONENTS**: Build reusable icon components with proper TypeScript interfaces
   - **DOCUMENT ICON USAGE**: Document all available icons and their proper usage
9. **🚨 CRITICAL: AMBIGUITY RESOLUTION PHASE**
   - **IDENTIFY MISSING SPECIFICATIONS**: Analyze Figma frames for gaps (hover states, focus styles, interaction behaviors, responsive breakpoints, error states, loading states, etc.)
   - **DOCUMENT ALL AMBIGUITIES**: Create detailed list of missing design specifications
   - **ASK CLARIFYING QUESTIONS**: Present ambiguities to user and request Figma updates
   - **PREFER FIGMA UPDATES**: Strongly encourage adding missing states/specs to Figma for future consistency
   - **ALLOW CHAT SPECIFICATIONS**: Accept user specifications in chat only if Figma updates aren't feasible
   - **WAIT FOR RESOLUTION**: Do not proceed with implementation until all ambiguities are resolved
   - **RE-EXTRACT IF UPDATED**: If Figma is updated, re-extract design specifications before building
10. **🚨 MANDATORY: Follow Component Architecture Pattern**
   - **BEFORE writing any code**: Review ReferenceComponent.tsx for architecture reference
   - **ALWAYS use CVA (Class Variance Authority)** for component variants - NO EXCEPTIONS
   - **NEVER use inline styles** with JavaScript objects or semanticColors imports
   - **ALWAYS use Tailwind CSS classes** that reference design tokens (bg-neutral-bg-primary, text-primary-500, etc.)
   - **FOLLOW the exact same pattern** as ReferenceComponent.tsx in the design system
   - **CONSISTENCY CHECK**: Every new component must match the architectural style
11. **Build React components systematically** with extracted specifications (zero assumptions)
12. **🚨 MANDATORY: IMMEDIATE VALIDATION AFTER BUILDING**
   - **STEP 1: ARCHITECTURAL VALIDATION** 
     - **IMMEDIATELY** run `npm run validate:architecture` after creating component
     - **MUST achieve 100% compliance** before proceeding to next step
     - **FIX ALL VIOLATIONS** found (hardcoded colors, missing CVA, etc.)
     - **RE-RUN VALIDATION** until perfect compliance achieved
   - **STEP 2: BUILD VERIFICATION**
     - **IMMEDIATELY** run `npm run build` to verify component compiles
     - **FIX ANY BUILD ERRORS** before proceeding
   - **STEP 3: TYPE CHECKING**
     - **IMMEDIATELY** run `npx tsc --noEmit` to verify TypeScript compliance
     - **RESOLVE ALL TYPE ERRORS** before proceeding
   - **STEP 4: AUTOMATED VISUAL VERIFICATION**
     - **IMMEDIATELY** run `npm run claude-visual-verify ComponentName`
     - **IMMEDIATELY** analyze captured screenshots using Read tool
     - **IMMEDIATELY** compare against Figma designs for pixel accuracy
     - **IMMEDIATELY** verify design token usage and visual quality
     - **REQUIRED**: 95%+ pixel accuracy before proceeding
   - **🚨 COMPONENT IS NOT COMPLETE UNTIL ALL VALIDATIONS PASS**

### 4. Code Quality & Consistency
- Maintain **consistent naming conventions** (PascalCase for components, camelCase for props)
- Use **composition over inheritance** patterns
- Implement **proper error boundaries** and error handling
- Write **comprehensive unit tests** for all component logic and user interactions
- Include **accessibility tests** using @testing-library/jest-dom and axe-core
- Implement **visual regression tests** where appropriate

## Key Principles

### Design-First Approach - CRITICAL RULE
- **NEVER create components without Figma design data** - Do not build "common" or "standard" components
- **NEVER fall back to assumptions** - If Figma connection fails or data is missing, stop and request proper design links
- **NEVER improvise designs** - Every component must be built exactly to the specifications from Figma
- **NEVER assume ANY design values** - All padding, margins, borders, spacing, sizing, colors, typography, effects must come directly from Figma
- **🔍 EXTRACT EVERY PIXEL MEASUREMENT** - Use the comprehensive Figma extraction guide for 100% property coverage
- **📏 MEASURE EVERYTHING PRECISELY** - No rounding, no estimating, no "looks about right" values
- **🎨 MAP ALL DESIGN TOKENS** - Every color, spacing, typography property must reference exact Figma tokens
- **📱 CAPTURE ALL STATES & BREAKPOINTS** - Hover, focus, active, disabled, mobile, tablet, desktop variations
- **✅ DOCUMENT EXTRACTION COMPLETELY** - Use mandatory documentation template with every property recorded
- **ALWAYS verify Figma data** - Confirm you can access and analyze the provided Figma frames before starting development
- **WAIT for proper design specifications** - If design data is incomplete or inaccessible, request clarification rather than proceeding
- **EXTRACT design tokens from Figma** - All colors, spacing, typography must come directly from Figma design tokens
- **BUILD for instant rebrand capability** - Design token changes in Figma should automatically propagate to all components

### 🚨 CRITICAL: Design Token Implementation Pattern
**MANDATORY ARCHITECTURE - NO EXCEPTIONS:**

**1. COMPONENT ARCHITECTURE REQUIREMENTS:**
- **ALWAYS use Class Variance Authority (CVA)** for component variants
- **NEVER use inline styles** with JavaScript objects or `style={{}}` attributes
- **ALWAYS use Tailwind CSS classes** that reference design tokens via CSS custom properties
- **FOLLOW the exact same pattern** as ReferenceComponent.tsx

**2. REQUIRED IMPORTS & STRUCTURE:**
```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/classNames';

// Component variants using CVA - MANDATORY PATTERN
const componentVariants = cva(
  [
    // Base styles using design token classes
    'bg-neutral-bg-primary',
    'text-neutral-text-primary'
  ],
  {
    variants: {
      variant: {
        primary: ['bg-interactive-bg-bold', 'text-interactive-text-on-fill'],
        secondary: ['bg-neutral-bg-primary', 'border-interactive-border-bold']
      },
      size: {
        small: ['text-sm', 'px-2', 'py-1'],
        large: ['text-lg', 'px-4', 'py-2']
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'small'
    }
  }
);
```

**3. DESIGN TOKEN CLASS USAGE:**
- **Colors**: `bg-interactive-bg-bold`, `text-neutral-text-primary`, `border-primary-500`
- **Spacing**: Use standard Tailwind classes `px-4`, `py-2`, `gap-2`, `mb-1`
- **Typography**: `text-[14px]`, `font-medium`, `leading-[1.25]`
- **States**: Map to design token classes via CVA variants

**4. FORBIDDEN PATTERNS:**
```typescript
// ❌ NEVER DO THIS - Inline styles with JS objects
style={{ color: semanticColors.neutral.text.primary }}
style={{ backgroundColor: colors.primary[500] }}

// ❌ NEVER DO THIS - Direct token imports for styling
import { semanticColors } from '../../../tokens/colors';

// ✅ ALWAYS DO THIS - CVA + Tailwind classes
className={cn(componentVariants({ variant, size }))}
className="bg-neutral-bg-primary text-interactive-text-default"
```

**5. CONSISTENCY VERIFICATION:**
- **Before building any component**: Review ReferenceComponent.tsx for pattern reference
- **Every component MUST follow** the exact same CVA + Tailwind architecture
- **No exceptions** - inline styles break the design system architecture

### Design Token Class Reference
- **Backgrounds**: `bg-neutral-bg-primary`, `bg-interactive-bg-bold`, `bg-error-500`
- **Text Colors**: `text-neutral-text-primary`, `text-interactive-text-on-fill`, `text-error-500`
- **Borders**: `border-neutral-border-strong`, `border-primary-500`, `border-error-500`
- **Interactive States**: Managed through CVA variants, not inline styles
- **CRITICAL**: All classes map to CSS custom properties in tailwind.config.js

### Responsive Design Requirements
- **Mobile-First Approach**: Design for mobile screens first, then enhance for larger screens
- **Breakpoint Consistency**: Use standardized breakpoints across all components
- **Touch-Friendly**: Ensure interactive elements meet minimum touch target sizes (44px minimum)
- **Content Adaptation**: Text, spacing, and layouts must adapt gracefully across screen sizes
- **Performance**: Responsive implementations should not impact load times or performance

### Accessibility Requirements
- Include proper ARIA labels and descriptions
- Ensure keyboard navigation support
- Maintain color contrast ratios
- Use semantic HTML elements
- Test with screen readers

## Workflow Process

### Component Addition Phase
1. **User Initiation**: Wait for user to say "I'm ready to add a new component"
2. **Figma Frame Collection**: Request and collect all relevant Figma frame links
3. **Figma Connection Verification**: Confirm successful connection to Figma and ability to access frame data
   - If connection fails: Stop immediately and inform user of connection issues
   - If frames are inaccessible: Request corrected/updated Figma links
   - If design data is incomplete: Ask for additional frames or clarification
   - **NEVER proceed without complete Figma design data**
4. **Design Token Extraction**: Extract and verify design tokens from Figma frames
5. **Design Analysis**: Use Figma MCP to analyze designs and extract specifications
6. **Component Planning**: Determine atomic design level and component structure
7. **Implementation**: Build React component using extracted design tokens exclusively
8. **🚨 MANDATORY IMMEDIATE VALIDATION**: After building component, IMMEDIATELY run:
   - `npm run validate:architecture` (MUST achieve 100% compliance)
   - `npm run build` (MUST compile without errors)
   - `npx tsc --noEmit` (MUST pass type checking)
   - `npm run claude-visual-verify ComponentName` (MUST achieve 95%+ pixel accuracy)
   - **Component is NOT complete until ALL validations pass**
9. **Test Development**: Write comprehensive unit tests, accessibility tests, and interaction tests
10. **Documentation**: Write component docs and Storybook stories
11. **Final Quality Assurance**: Run all remaining tests and ensure component meets standards

### Quality Assurance
- **🚨 MANDATORY: 100% Architectural Compliance** - Every component MUST pass `npm run validate:architecture`
- **🚨 MANDATORY: Build Success** - Every component MUST compile without errors
- **🚨 MANDATORY: Type Safety** - Every component MUST pass TypeScript checking
- **🚨 MANDATORY: Visual Fidelity** - Every component MUST achieve 95%+ pixel accuracy vs Figma
- Every component must have TypeScript interfaces extending shared base types
- Every component must have comprehensive tests using shared testing utilities
- Every component must have accessibility tests using shared a11y patterns
- Every component must be fully responsive (mobile-first design with desktop enhancements)
- Every component must meet minimum touch target requirements (44px minimum)
- **Every component must use ONLY design tokens extracted from Figma - no hardcoded values**
- **Every design value must be rebrand-ready through Figma design token system**

## Session Startup Checklist
1. Read this entire CLAUDE.md file
2. Read LEARNING-LOG.md for architectural decisions and updates
3. **🚨 MANDATORY: Review component architecture patterns**
   - **Read ReferenceComponent.tsx** - The canonical implementation pattern
   - **Check tailwind.config.js** to understand design token class mappings
   - **MEMORIZE the forbidden patterns** - No inline styles, no semanticColors imports
4. Confirm Figma MCP connection is active
5. Run `npm run validate-tokens` to verify token readiness
6. **🚨 CRITICAL: Run `npm run validate:architecture`** to see current architectural compliance
7. **🚨 CHECK ASSET DISCOVERY STATUS**: Review figma.config.json
   - Check if design token sources are documented
   - Verify icon system information is captured
   - Note any missing asset discovery that needs to be completed
8. **🚨 COMMIT TO CONSISTENCY**: Every new component will follow the exact same CVA + Tailwind pattern
9. **🚨 MANDATORY RULE**: When user says "I'm ready to add a new component", ALWAYS run `npm run pre-component ComponentName` FIRST
10. Wait for user to say "I'm ready to add a new component"

## Never Create Components Without Figma
I only build components from Figma designs - no assumptions or fallbacks!
All design values must come from Figma design tokens for instant rebrand capability!

## Communication Style
- **Start each session by reading `CLAUDE.md` in the project root**
- Be proactive in suggesting improvements and alternatives
- Ask clarifying questions about design intent when ambiguous
- Explain technical decisions and trade-offs
- Provide clear status updates during development
- Offer suggestions for component API improvements
- **Always confirm Figma access before starting any component work**
- **Never apologize for not creating fallback components - this is correct behavior**
- **Be explicit when stopping due to missing/inaccessible design data**

## Error Handling & Validation
- If Figma frames are not accessible: "I cannot access the Figma frames you provided. Please verify the links and ensure they have proper sharing permissions."
- If Figma connection fails: "I'm unable to connect to Figma right now. Please check the MCP connection and try again."
- If design specifications are incomplete: "The Figma frames don't contain sufficient detail for [specific element]. Please provide additional frames showing [missing information]."
- **Never create placeholder or example components** - always wait for proper design data
- **Never estimate or guess measurements** - request clarification for any unclear values

## 🚨 CRITICAL FONT REQUIREMENTS

### Sharp Sans Font Installation
All Figma designs use **Sharp Sans Medium** font family. This font MUST be installed before component development.

**Installation Steps:**
1. **Download Sharp Sans** from CustomInk's design assets or font provider
2. **Install system-wide** on your operating system:
   - **macOS**: Double-click .otf/.ttf files → "Install Font"
   - **Windows**: Right-click .otf/.ttf files → "Install"  
   - **Linux**: Copy to `~/.fonts/` directory and run `fc-cache -fv`
3. **Verify installation**: Font should appear in browser dev tools font lists
4. **Restart development servers** (Storybook, etc.) after font installation

**Without Sharp Sans:**
- Components will fall back to system fonts (incorrect appearance)
- Visual verification will fail Figma accuracy checks
- Typography spacing and rendering will be incorrect

**Verification:**
- All components use `font-['Sharp_Sans:Medium',_sans-serif]` in Tailwind classes
- Browser dev tools should show "Sharp Sans" as active font
- Text rendering should match Figma designs exactly

Remember: Consistency is key. Every component should feel like it belongs to the same design system, following identical patterns, naming conventions, and architectural decisions. **Most importantly: Never build anything without explicit design specifications from Figma.**