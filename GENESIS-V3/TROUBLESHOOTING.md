# GENESIS-V3 Troubleshooting Guide

This document covers common issues encountered during GENESIS-V3 setup and their solutions.

## 🚨 Critical Issues

### 1. Storybook Shows Unstyled Content / Tailwind Not Working

**Symptoms:**
- Welcome page appears as plain HTML without styling
- Text lacks colors, spacing, backgrounds
- Components appear broken or unstyled
- Console shows no CSS errors

**Root Cause:**
Empty token files prevent Tailwind from generating utility classes. When `src/tokens/tailwind-tokens.generated.js` contains only `{ colors: {}, spacing: {} }`, Tailwind has no values to generate CSS classes from.

**Solution:**
```bash
# Run the corrected setup command
npm run setup:placeholders

# Verify the token file contains actual values
cat src/tokens/tailwind-tokens.generated.js

# Should show colors like 'gray-900': '#111827', not empty objects
```

**Prevention:**
The `setup:placeholders` command now creates functional tokens instead of empty objects.

### 2. PostCSS Module Errors in Storybook

**Symptoms:**
```
ReferenceError: module is not defined in ES module scope
```

**Root Cause:**
`postcss.config.js` uses CommonJS syntax but package.json has `"type": "module"`.

**Solution:**
```bash
# Rename the file to use .cjs extension
mv postcss.config.js postcss.config.cjs
```

**Prevention:**
GENESIS-V3 now creates `postcss.config.cjs` by default.

### 3. Token Architecture Maintains Design System Purity

**NEW ARCHITECTURE - Two Separate Token Systems:**

**Problem Solved:** Empty token files broke Tailwind, but we needed to maintain design system purity.

**Solution:** Separate token files with clear responsibilities:

1. **`src/tokens/tailwind-tokens.generated.js`** - PURE Figma tokens only
   ```javascript
   // PURE - Only Figma tokens, starts empty
   module.exports = { colors: {}, spacing: {} }; // PURE: Only Figma tokens go here
   ```

2. **`src/tokens/storybook-tokens.js`** - Static tokens for stories only
   ```javascript
   // 🚨 STORYBOOK ONLY - NOT for components
   module.exports = {
     colors: {
       'gray-50': '#f9fafb',
       'gray-600': '#4b5563',
       // ... basic colors for Storybook stories
     },
     // ... spacing, fonts, etc.
   };
   ```

**Tailwind merges both with Figma taking precedence:**
- Storybook tokens enable initial styling (Welcome page works)
- Figma tokens override when available (components get real design)
- Components must NEVER reference storybook tokens directly

**Benefits:**
- ✅ Storybook works immediately with Welcome page
- ✅ Design system purity maintained (components only use Figma)
- ✅ Clear separation of concerns
- ✅ Figma tokens always take precedence

## 🔧 Quick Fixes

### Reset Token Files
```bash
# Delete broken tokens
rm -f src/tokens/tailwind-tokens.generated.js src/tokens/storybook-tokens.js

# Recreate with proper separation
npm run setup:placeholders

# Verify separation:
echo "=== FIGMA TOKENS (should be empty) ==="
cat src/tokens/tailwind-tokens.generated.js

echo "=== STORYBOOK TOKENS (should have colors) ==="
grep "gray-900" src/tokens/storybook-tokens.js
```

### Verify Storybook Setup
```bash
# Check for welcome page first
grep -n "Welcome.stories.tsx" .storybook/main.ts

# Should show it's listed first in stories array
```

### Check PostCSS Config
```bash
# Ensure correct extension
ls -la postcss.config.*

# Should show postcss.config.cjs, not .js
```

## 📋 Validation Checklist

After setup, verify these items work:

- [ ] `npm run dev` starts Storybook without errors
- [ ] Welcome page appears first and is properly styled  
- [ ] Tailwind classes apply (check browser dev tools)
- [ ] No ES module errors in console
- [ ] Token files contain actual values, not empty objects

## 🚨 Emergency Recovery

If everything is broken:

```bash
# 1. Stop all processes
pkill -f storybook
pkill -f node

# 2. Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Reset token files
npm run setup:placeholders

# 4. Verify config files
# - postcss.config.cjs exists
# - tailwind.config.js imports tokens correctly
# - .storybook/main.ts shows Welcome first

# 5. Restart
npm run dev
```

## 📚 Understanding the Fix

The key insight was that Tailwind CSS is **token-driven**. Without actual token values:

1. **No utility classes exist** - `text-4xl`, `bg-blue-600`, etc. don't exist
2. **CSS file is nearly empty** - Only base styles, no utilities
3. **Components render unstyled** - Classes have no effect

By providing functional tokens during setup:

1. **Tailwind generates classes** - All standard utilities available
2. **Storybook works immediately** - Welcome page renders properly  
3. **Development can begin** - Real tokens replace these later

## 🔮 Future Improvements

Consider for future GENESIS versions:

1. **Token validation script** - Check if tokens are empty/invalid
2. **Storybook health check** - Verify styling works during setup
3. **Visual regression** - Catch styling breaks automatically
4. **Better error messages** - Detect and explain token-related issues

## 📝 Lessons Learned

1. **Functional defaults > Empty objects** - Better to have working basics
2. **ES modules need .cjs** - File extensions matter
3. **Visual validation essential** - Styling breaks aren't always obvious
4. **Bootstrap experience matters** - First impression must work perfectly

This troubleshooting guide will be updated as new issues are discovered.