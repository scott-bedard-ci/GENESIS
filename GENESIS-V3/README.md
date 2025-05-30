# GENESIS-V3: Pigment-Genesis Design System Setup

## 🚀 Quick Start for Claude

**Copy and paste this prompt to Claude to begin:**

```
Initialize the project by looking in the GENESIS-V3 folder and starting with the README.md file as your initial prompt. If you need to make any adjustments to what is in the instructions, log the changes in a file called GENESIS-V3-CHANGES.md
```

## 🎯 Overview

GENESIS-V3 splits the setup into manageable files that Claude can read without token limit issues. Follow these files **in exact order**.

## 📚 Setup Files (Read in Order)

1. **[INIT.md](./INIT.md)** - Start here! Project initialization and dependencies
2. **[STEP-1-CORE-CONFIG.md](./STEP-1-CORE-CONFIG.md)** - TypeScript, Tailwind, Jest, and build configs
3. **[STEP-2-VALIDATION-SCRIPTS.md](./STEP-2-VALIDATION-SCRIPTS.md)** - All validation and setup scripts
4. **[STEP-3-FIGMA-SCRIPTS.md](./STEP-3-FIGMA-SCRIPTS.md)** - Token extraction and rebrand scripts
5. **[STEP-4-INSTRUCTIONS.md](./STEP-4-INSTRUCTIONS.md)** - Claude instructions and documentation
6. **[STEP-5-SOURCE-FILES.md](./STEP-5-SOURCE-FILES.md)** - Types, utilities, and reference implementation
7. **[COMPONENT-TEMPLATE.md](./COMPONENT-TEMPLATE.md)** - Complete component structure template
8. **[FINAL-VALIDATION.md](./FINAL-VALIDATION.md)** - Verify everything was created correctly

### 📁 Included Resources

- **`reference-implementation/`** - Complete 7-file reference component demonstrating all patterns

## ✅ Quality First

**Remember**: Take unlimited time to achieve perfection. Quality > Speed always.

## 🚨 MANDATORY: Component Validation Workflow

**Every component MUST pass this 4-step validation immediately after building:**

1. `npm run validate:architecture` (100% compliance required)
2. `npm run build` (must compile without errors)
3. `npx tsc --noEmit` (must pass type checking)
4. `npm run claude-visual-verify ComponentName` (95%+ pixel accuracy required)

**Component is NOT complete until ALL validations pass.**

## 🚨 Critical Success Factors

- **ALL files must be created** - No skipping any step
- **Order matters** - Dependencies exist between steps
- **52 total files minimum** - Use final validation to verify
- **Phase 0 prerequisite** - Must have Figma tokens before starting

## 📋 Quick Checklist

After completing all steps, you should have:
- [ ] 11 script files in `/scripts/`
- [ ] 11 configuration files in root (including .gitignore)
- [ ] 9 documentation files (including READMEs and GENESIS-V3 docs)
- [ ] 19+ source files in `/src/` (including 7 reference component files)
- [ ] 2 Storybook configs
- [ ] **Total: 52+ files minimum**

Note: This includes the 7 reference component files copied from GENESIS-V3/reference-implementation/

## 🚀 Start Setup

👉 **[Begin with INIT.md](./INIT.md)**

---

## 🎯 AFTER BOOTSTRAP: Getting Started with Component Development

### What to Do After Bootstrap is Complete

Once you've completed all GENESIS-V3 setup steps and validated everything, you're ready to start building components. Here's exactly what to do:

### 1. **First-Time Asset Discovery**

**Prompt Claude with:**
```
I've completed the GENESIS-V3 bootstrap. I'm ready to provide design system assets. 

Here's what I have available:
- [Describe your design token sources - Figma Variables, JSON files, Style Dictionary, etc.]
- [Describe your icon system - where icons live in Figma]
- [List priority components you need built]
- [Describe your Figma file organization]

Let's start with asset discovery.
```

Claude will then ask you specific questions to gather:
- **Design Tokens**: Master token lists, color palettes, spacing scales, typography
- **Icon System**: Complete icon library location in Figma
- **Component Priorities**: Which components to build first
- **Figma Organization**: How your design files are structured

### 2. **Provide Design Tokens (If You Have Them)**

**If you have exported design tokens, prompt Claude:**
```
Here are my exported design tokens from [source]:

[Paste your JSON/Style Dictionary/CSS variables here]

Please import these into the design system.
```

**If you DON'T have exported tokens:**
```
I don't have exported design tokens yet. They're defined in my Figma file. 
Let's extract them directly from Figma when we build the first component.
```

### 3. **Extract Icon System**

**Prompt Claude with:**
```
Here's the Figma frame containing our complete icon library:
[Paste Figma URL to icon library frame]

Please extract all icons and create the icon system components.
```

### 4. **Start Building Components**

**🚨 CRITICAL**: Every component MUST follow the complete structure defined in `GENESIS-V3/COMPONENT-TEMPLATE.md`. Claude will create all 7 required files using the patterns from `src/_reference/`.

**When ready to build your first component:**
```
I'm ready to add a new component.

Component: Button
Priority: High
Figma frames: [paste Figma URLs for all Button states/variants]
```

**Claude will then:**
1. Run `npm run pre-component Button atoms` (mandatory validation)
2. Extract all design specifications from Figma
3. Create ALL required files following COMPONENT-TEMPLATE.md:
   - Button.tsx (component implementation)
   - Button.figmaframes.md (Figma documentation)
   - Button.stories.tsx (Storybook stories)
   - Button.test.tsx (comprehensive tests)
   - Button.tokens.md (token documentation)
   - index.ts (exports)
4. Run all validations (architecture, build, types, visual)
5. Achieve 100% compliance before marking complete

### 📋 Quick Reference: Essential Prompts

**Asset Discovery:**
```
Let's do asset discovery for my design system.
```

**Provide Tokens:**
```
Here are my design tokens: [paste tokens]
```

**Extract Icons:**
```
Here's my icon library in Figma: [paste URL]
```

**Build Component:**
```
I'm ready to add a new component: [ComponentName]
Figma frames: [paste URLs]
```

**Rebrand Check:**
```
I've updated my design tokens in Figma. Let's preview what will change.
```

### 🚨 Important Notes

1. **Quality Over Speed**: Claude will take time to analyze Figma frames thoroughly. This is intentional.
2. **Token Extraction**: If you don't have tokens exported, they'll be extracted during first component build.
3. **100% Compliance Required**: Components won't proceed if validation fails.
4. **Figma is Truth**: All design values come from Figma - no assumptions or defaults.

### 🎉 You're Ready!

With bootstrap complete and these prompts, you can now:
- Import existing design tokens
- Extract icon systems
- Build components with perfect Figma fidelity
- Maintain 100% rebrand capability

Remember: Every component will be built to perfection, not speed.