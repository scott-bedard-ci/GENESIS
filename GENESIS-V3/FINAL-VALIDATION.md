# FINAL VALIDATION: Verify Complete Setup

## 🎯 Purpose

This file helps you verify that all 40+ required files have been created correctly. Run through this checklist to ensure your Pigment-Genesis design system is fully set up.

## ✅ Complete File Checklist

### 📁 Configuration Files (11 files)
- [ ] `.gitignore`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `jest.config.js`
- [ ] `jest.setup.js`
- [ ] `tsup.config.ts`
- [ ] `.eslintrc.js`
- [ ] `.prettierrc`
- [ ] `figma.config.json`

### 📁 Storybook Configuration (2 files)
- [ ] `.storybook/main.ts`
- [ ] `.storybook/preview.ts`

### 📁 Scripts Directory (11 files)
- [ ] `scripts/extract-figma-tokens.ts`
- [ ] `scripts/generate-token-files.ts`
- [ ] `scripts/validate-design-tokens.ts`
- [ ] `scripts/preview-rebrand-changes.ts`
- [ ] `scripts/validate-component-architecture.ts`
- [ ] `scripts/validate-rebrand-capability.ts`
- [ ] `scripts/setup-reference-implementation.ts`
- [ ] `scripts/setup-validation.ts`
- [ ] `scripts/visual-verification.ts`
- [ ] `scripts/claude-visual-verify.ts`
- [ ] `scripts/validate-visual-compliance.ts`

### 📁 Documentation Files (8 files)
- [ ] `CLAUDE.md`
- [ ] `CLAUDE-OPUS.md`
- [ ] `LEARNING-LOG.md`
- [ ] `VERSION-HISTORY.md`
- [ ] `CONTRIBUTING.md`
- [ ] `README.md` (should already exist or be created)
- [ ] `src/_reference/README.md` (created by setup script)
- [ ] `GENESIS-V3/README.md` (this setup guide)

### 📁 Source Files (8+ files)
- [ ] `src/types/tokens.ts`
- [ ] `src/types/component.ts`
- [ ] `src/utils/classNames.ts`
- [ ] `src/utils/componentVariants.ts`
- [ ] `src/utils/storybook.ts`
- [ ] `src/styles/globals.css`
- [ ] `src/index.ts`
- [ ] `src/components/index.ts`
- [ ] `src/_reference/ReferenceComponent.tsx` (created by setup script)
- [ ] `src/_reference/README.md` (created by setup script)

### 📁 Additional Files (Created by scripts)
- [ ] `package.json` (with all scripts)
- [ ] `.validation-summary.json` (created by setup-validation.ts)
- [ ] `.vscode/tasks.json` (created by setup-validation.ts)
- [ ] `.git/hooks/pre-commit` (created by setup-validation.ts)

**TOTAL MINIMUM: 40+ files**

Note: The exact count depends on whether you count generated files and those created by setup scripts.

## 🔍 Validation Commands

Run these commands to verify everything is set up correctly:

### 1. Check File Count
```bash
# Count all created files (excluding node_modules and generated files)
find . -type f \
  -not -path "./node_modules/*" \
  -not -path "./dist/*" \
  -not -path "./.git/*" \
  -not -name "*.generated.*" \
  | wc -l
```

### 2. Run Setup Scripts
```bash
# Run reference implementation setup
npm run setup:reference

# This should create:
# - src/_reference/ReferenceComponent.tsx
# - src/_reference/README.md
# - src/utils/classNames.ts (if not already created)
```

### 3. Validate Token Extraction
```bash
# Note: This requires Figma connection
# npm run extract-figma-tokens

# For now, create placeholder token files manually:
mkdir -p src/tokens
echo '{"colors":{},"spacing":{},"typography":{},"effects":{}}' > src/tokens/figma-tokens.json
echo 'module.exports = { colors: {}, spacing: {} }' > src/tokens/tailwind-tokens.generated.js
```

### 4. Run All Validations
```bash
# Install dependencies first
npm install

# Run architectural validation
npm run validate:architecture

# Run token validation (will fail without real tokens)
npm run validate:tokens || true

# Run setup validation
npm run setup:validation
```

### 5. Start Development Environment
```bash
# Start Storybook
npm run dev

# In another terminal, run tests
npm test
```

## 🚨 Common Issues & Fixes

### Missing Dependencies
If you get errors about missing packages, these were commonly missed in the original instructions:
```bash
npm install --save-dev \
  identity-obj-proxy@^3.0.0 \
  eslint-plugin-react@^7.34.1 \
  eslint-plugin-react-hooks@^4.6.0 \
  eslint-plugin-jsx-a11y@^6.8.0 \
  eslint-plugin-storybook@^0.8.0 \
  @storybook/addon-interactions@^8.0.8
```

### TypeScript Errors
If TypeScript complains about missing types:
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

### Tailwind Not Working
If Tailwind classes aren't applying:
1. Check that `postcss.config.js` exists
2. Verify `tailwind.config.js` is properly configured
3. Ensure `src/styles/globals.css` is imported in Storybook preview

### Scripts Not Found
If npm scripts fail:
1. Verify all script files have the shebang: `#!/usr/bin/env tsx`
2. Make scripts executable: `chmod +x scripts/*.ts`
3. Ensure tsx is installed: `npm install --save-dev tsx`

## 📊 Success Criteria

Your setup is complete when:
- ✅ All 40+ files are created
- ✅ Placeholder token files exist (prevents build errors)
- ✅ `npm run validate:architecture` passes
- ✅ `npm run dev` starts Storybook successfully
- ✅ `npm test` runs without errors
- ✅ ReferenceComponent.tsx scores 100% on validation

## 🎉 Setup Complete!

Once all checks pass, your Pigment-Genesis design system is ready for component development!

### Next Steps:
1. Connect to Figma and extract real design tokens
2. Start building components using the established patterns
3. Follow the workflow in CONTRIBUTING.md
4. Document discoveries in LEARNING-LOG.md

Remember: **Quality over speed. Every component must be perfect.**

## 📚 Quick Reference

### Key Files:
- **Pattern Reference**: `src/_reference/ReferenceComponent.tsx`
- **Implementation Guide**: `CLAUDE.md`
- **Architecture Guide**: `CLAUDE-OPUS.md`
- **Team Guide**: `CONTRIBUTING.md`

### Key Commands:
```bash
npm run validate:all          # Run all validations
npm run claude-visual-verify  # Visual verification
npm run extract-figma-tokens  # Update design tokens
npm run dev                   # Start Storybook
```

## 🐛 Still Having Issues?

If you encounter problems not covered here:
1. Check LEARNING-LOG.md for known issues
2. Review the specific STEP-*.md file for that section
3. Ensure you followed the files in order (INIT → STEP-1 → ... → FINAL)
4. Verify no steps were skipped

**Remember**: The goal is a perfect design system. Take the time to get the foundation right!