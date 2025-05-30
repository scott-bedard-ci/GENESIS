# STEP 3: Figma Integration Scripts

This step creates all scripts for Figma token extraction, design token management, and visual verification.

## Token Extraction Script

### 🚨 CREATE THIS FILE: `scripts/extract-figma-tokens.ts`
```typescript
#!/usr/bin/env tsx

/**
 * 🚨 MANDATORY FIRST STEP: Extract all design tokens from Figma
 * This MUST succeed before any component development can begin
 */

import fs from 'fs';
import path from 'path';

interface FigmaTokens {
  colors: Record<string, any>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  effects: Record<string, any>;
  breakpoints: Record<string, string>;
}

interface TokenExtractionResult {
  success: boolean;
  tokens?: FigmaTokens;
  errors: string[];
  warnings: string[];
}

async function extractFigmaTokens(): Promise<TokenExtractionResult> {
  console.log('🎨 EXTRACTING DESIGN TOKENS FROM FIGMA');
  console.log('=====================================\n');
  
  // Check for Figma connection
  console.log('🔍 Checking Figma connection...');
  const figmaConnected = await checkFigmaConnection();
  
  if (!figmaConnected) {
    return {
      success: false,
      errors: [
        'Figma connection not available',
        'Please ensure Figma MCP is connected',
        'Run: figma-connect setup'
      ],
      warnings: []
    };
  }
  
  // Get Figma file/frame info from user
  const figmaInfo = await getFigmaTokenSource();
  if (!figmaInfo) {
    return {
      success: false,
      errors: [
        'No Figma source provided',
        'Please provide Figma file URL or frame containing design tokens'
      ],
      warnings: []
    };
  }
  
  // Extract tokens from Figma
  console.log('📥 Extracting tokens from Figma...');
  const tokens = await extractTokensFromFigma(figmaInfo);
  
  if (!tokens || Object.keys(tokens).length === 0) {
    return {
      success: false,
      errors: [
        'No design tokens found in Figma',
        'Please ensure your Figma file has properly defined design tokens',
        'Required token categories: colors, spacing, typography, effects'
      ],
      warnings: []
    };
  }
  
  // Validate token completeness
  const validation = validateTokenCompleteness(tokens);
  if (!validation.isComplete) {
    return {
      success: false,
      tokens,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }
  
  // Save raw tokens
  const tokenPath = path.join(process.cwd(), 'src/tokens/figma-tokens.json');
  fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
  fs.writeFileSync(
    tokenPath,
    JSON.stringify({
      metadata: {
        extractedAt: new Date().toISOString(),
        figmaSource: figmaInfo,
        version: '1.0.0'
      },
      tokens
    }, null, 2)
  );
  
  // Generate derived files
  await generateTokenFiles(tokens);
  
  console.log('\n✅ FIGMA TOKEN EXTRACTION SUCCESSFUL!');
  console.log('📊 Token Statistics:');
  console.log(`   Colors: ${Object.keys(tokens.colors || {}).length} tokens`);
  console.log(`   Spacing: ${Object.keys(tokens.spacing || {}).length} tokens`);
  console.log(`   Typography: ${Object.keys(tokens.typography || {}).length} definitions`);
  console.log(`   Effects: ${Object.keys(tokens.effects || {}).length} tokens`);
  console.log('\n🎉 Design system ready for development!');
  
  return {
    success: true,
    tokens,
    errors: [],
    warnings: validation.warnings
  };
}

function validateTokenCompleteness(tokens: any): {
  isComplete: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required token categories
  const requiredCategories = ['colors', 'spacing', 'typography'];
  const optionalCategories = ['effects', 'breakpoints', 'animations'];
  
  // Check required categories
  requiredCategories.forEach(category => {
    if (!tokens[category] || Object.keys(tokens[category]).length === 0) {
      errors.push(`Missing required token category: ${category}`);
    }
  });
  
  // Check optional categories
  optionalCategories.forEach(category => {
    if (!tokens[category] || Object.keys(tokens[category]).length === 0) {
      warnings.push(`Optional token category not found: ${category}`);
    }
  });
  
  // Validate color tokens structure
  if (tokens.colors) {
    const requiredColorGroups = ['neutral', 'interactive'];
    requiredColorGroups.forEach(group => {
      if (!tokens.colors[group]) {
        errors.push(`Missing required color group: ${group}`);
      }
    });
  }
  
  return {
    isComplete: errors.length === 0,
    errors,
    warnings
  };
}

async function generateTokenFiles(tokens: FigmaTokens) {
  console.log('\n🔧 Generating token files...');
  
  // Generate CSS variables
  await generateCSSVariables(tokens);
  console.log('   ✅ Generated CSS variables');
  
  // Generate Tailwind tokens
  await generateTailwindTokens(tokens);
  console.log('   ✅ Generated Tailwind token mappings');
  
  // Generate TypeScript token files
  await generateTypeScriptTokens(tokens);
  console.log('   ✅ Generated TypeScript token definitions');
}

async function generateCSSVariables(tokens: FigmaTokens) {
  const cssVars = `/* 
 * 🚨 AUTO-GENERATED FROM FIGMA - DO NOT EDIT MANUALLY
 * Generated: ${new Date().toISOString()}
 * Source: Figma Design System
 * 
 * To update: npm run extract-figma-tokens
 */

:root {
${generateColorVariables(tokens.colors)}
${generateSpacingVariables(tokens.spacing)}
${generateTypographyVariables(tokens.typography)}
${generateEffectVariables(tokens.effects)}
}`;

  const cssPath = path.join(process.cwd(), 'src/styles/tokens/css-variables.generated.css');
  fs.mkdirSync(path.dirname(cssPath), { recursive: true });
  fs.writeFileSync(cssPath, cssVars);
}

async function generateTailwindTokens(tokens: FigmaTokens) {
  const tailwindTokens = `// 🚨 AUTO-GENERATED FROM FIGMA - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}

module.exports = {
  colors: ${JSON.stringify(flattenColors(tokens.colors), null, 2)},
  spacing: ${JSON.stringify(tokens.spacing, null, 2)},
  fontSize: ${JSON.stringify(tokens.typography?.fontSize || {}, null, 2)},
  fontFamily: ${JSON.stringify(tokens.typography?.fontFamily || {}, null, 2)},
  fontWeight: ${JSON.stringify(tokens.typography?.fontWeight || {}, null, 2)},
  lineHeight: ${JSON.stringify(tokens.typography?.lineHeight || {}, null, 2)},
  borderRadius: ${JSON.stringify(tokens.effects?.borderRadius || {}, null, 2)},
  boxShadow: ${JSON.stringify(tokens.effects?.boxShadow || {}, null, 2)}
};`;

  const tailwindPath = path.join(process.cwd(), 'src/tokens/tailwind-tokens.generated.js');
  fs.mkdirSync(path.dirname(tailwindPath), { recursive: true });
  fs.writeFileSync(tailwindPath, tailwindTokens);
}

async function generateTypeScriptTokens(tokens: FigmaTokens) {
  const tsTokens = `// 🚨 AUTO-GENERATED FROM FIGMA - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}

export const designTokens = ${JSON.stringify(tokens, null, 2)} as const;

export type DesignTokens = typeof designTokens;
`;

  const tsPath = path.join(process.cwd(), 'src/tokens/design-tokens.generated.ts');
  fs.mkdirSync(path.dirname(tsPath), { recursive: true });
  fs.writeFileSync(tsPath, tsTokens);
}

function generateColorVariables(colors: any): string {
  const lines: string[] = ['  /* Color Tokens */'];
  
  Object.entries(colors).forEach(([group, values]) => {
    lines.push(`  /* ${group} */`);
    Object.entries(values as any).forEach(([key, value]) => {
      lines.push(`  --color-${group}-${key}: ${value};`);
    });
  });
  
  return lines.join('\n');
}

function generateSpacingVariables(spacing: any): string {
  const lines: string[] = ['\n  /* Spacing Tokens */'];
  
  Object.entries(spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });
  
  return lines.join('\n');
}

function generateTypographyVariables(typography: any): string {
  const lines: string[] = ['\n  /* Typography Tokens */'];
  
  if (typography.fontSize) {
    lines.push('  /* Font Sizes */');
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      lines.push(`  --font-size-${key}: ${value};`);
    });
  }
  
  if (typography.fontWeight) {
    lines.push('  /* Font Weights */');
    Object.entries(typography.fontWeight).forEach(([key, value]) => {
      lines.push(`  --font-weight-${key}: ${value};`);
    });
  }
  
  return lines.join('\n');
}

function generateEffectVariables(effects: any): string {
  const lines: string[] = ['\n  /* Effect Tokens */'];
  
  if (effects.boxShadow) {
    lines.push('  /* Shadows */');
    Object.entries(effects.boxShadow).forEach(([key, value]) => {
      lines.push(`  --shadow-${key}: ${value};`);
    });
  }
  
  return lines.join('\n');
}

function flattenColors(colors: any, prefix = ''): any {
  const result: any = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}-${key}` : key;
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenColors(value, newKey));
    } else {
      result[newKey] = value;
    }
  });
  
  return result;
}

// Placeholder functions for Figma connection
async function checkFigmaConnection(): Promise<boolean> {
  // TODO: Implement actual Figma connection check
  return true;
}

async function getFigmaTokenSource(): Promise<any> {
  // TODO: Implement Figma source retrieval
  return { fileId: 'example', nodeId: 'example' };
}

async function extractTokensFromFigma(figmaInfo: any): Promise<any> {
  // TODO: Implement actual Figma token extraction
  // This would use Figma API or MCP connection
  return {};
}

// Main execution
extractFigmaTokens().catch(console.error);
```

## Token File Generation

### 🚨 CREATE THIS FILE: `scripts/generate-token-files.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Generates all token files from extracted Figma tokens
 * This includes CSS variables, Tailwind config, and TypeScript definitions
 */

import fs from 'fs';
import path from 'path';

interface FigmaTokens {
  colors: Record<string, any>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  effects: Record<string, any>;
  breakpoints: Record<string, string>;
}

async function generateTokenFiles() {
  console.log('🔧 Generating token files from Figma extraction...\n');
  
  // Read extracted tokens
  const tokenPath = path.join(process.cwd(), 'src/tokens/figma-tokens.json');
  if (!fs.existsSync(tokenPath)) {
    console.error('❌ No Figma tokens found. Run extract-figma-tokens first.');
    process.exit(1);
  }
  
  const { tokens } = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  
  // Generate CSS Variables
  await generateCSSVariables(tokens);
  console.log('✅ Generated CSS variables');
  
  // Generate Tailwind token mapping
  await generateTailwindTokens(tokens);
  console.log('✅ Generated Tailwind token mappings');
  
  // Generate TypeScript token files
  await generateTypeScriptTokens(tokens);
  console.log('✅ Generated TypeScript token definitions');
  
  console.log('\n🎉 Token file generation complete!');
}

async function generateCSSVariables(tokens: FigmaTokens) {
  const cssVars = `/* 
 * 🚨 AUTO-GENERATED FROM FIGMA - DO NOT EDIT MANUALLY
 * Generated: ${new Date().toISOString()}
 * Source: Figma Design System
 * 
 * To update: npm run extract-figma-tokens
 */

:root {
${generateColorVariables(tokens.colors)}
${generateSpacingVariables(tokens.spacing)}
${generateTypographyVariables(tokens.typography)}
${generateEffectVariables(tokens.effects)}
}`;

  const cssPath = path.join(process.cwd(), 'src/styles/tokens/css-variables.generated.css');
  fs.mkdirSync(path.dirname(cssPath), { recursive: true });
  fs.writeFileSync(cssPath, cssVars);
}

async function generateTailwindTokens(tokens: FigmaTokens) {
  const tailwindTokens = `// 🚨 AUTO-GENERATED FROM FIGMA - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}

module.exports = {
  colors: ${JSON.stringify(flattenColors(tokens.colors), null, 2)},
  spacing: ${JSON.stringify(tokens.spacing, null, 2)},
  fontSize: ${JSON.stringify(tokens.typography?.fontSize || {}, null, 2)},
  fontFamily: ${JSON.stringify(tokens.typography?.fontFamily || {}, null, 2)},
  fontWeight: ${JSON.stringify(tokens.typography?.fontWeight || {}, null, 2)},
  lineHeight: ${JSON.stringify(tokens.typography?.lineHeight || {}, null, 2)},
  borderRadius: ${JSON.stringify(tokens.effects?.borderRadius || {}, null, 2)},
  boxShadow: ${JSON.stringify(tokens.effects?.boxShadow || {}, null, 2)}
};`;

  const tailwindPath = path.join(process.cwd(), 'src/tokens/tailwind-tokens.generated.js');
  fs.mkdirSync(path.dirname(tailwindPath), { recursive: true });
  fs.writeFileSync(tailwindPath, tailwindTokens);
}

async function generateTypeScriptTokens(tokens: FigmaTokens) {
  const tsTokens = `// 🚨 AUTO-GENERATED FROM FIGMA - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}

export const designTokens = ${JSON.stringify(tokens, null, 2)} as const;

export type DesignTokens = typeof designTokens;
`;

  const tsPath = path.join(process.cwd(), 'src/tokens/design-tokens.generated.ts');
  fs.mkdirSync(path.dirname(tsPath), { recursive: true });
  fs.writeFileSync(tsPath, tsTokens);
}

// Helper functions (same as in extract-figma-tokens.ts)
function generateColorVariables(colors: any): string {
  const lines: string[] = ['  /* Color Tokens */'];
  
  Object.entries(colors).forEach(([group, values]) => {
    lines.push(`  /* ${group} */`);
    Object.entries(values as any).forEach(([key, value]) => {
      lines.push(`  --color-${group}-${key}: ${value};`);
    });
  });
  
  return lines.join('\n');
}

function generateSpacingVariables(spacing: any): string {
  const lines: string[] = ['\n  /* Spacing Tokens */'];
  
  Object.entries(spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });
  
  return lines.join('\n');
}

function generateTypographyVariables(typography: any): string {
  const lines: string[] = ['\n  /* Typography Tokens */'];
  
  if (typography.fontSize) {
    lines.push('  /* Font Sizes */');
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      lines.push(`  --font-size-${key}: ${value};`);
    });
  }
  
  if (typography.fontWeight) {
    lines.push('  /* Font Weights */');
    Object.entries(typography.fontWeight).forEach(([key, value]) => {
      lines.push(`  --font-weight-${key}: ${value};`);
    });
  }
  
  return lines.join('\n');
}

function generateEffectVariables(effects: any): string {
  const lines: string[] = ['\n  /* Effect Tokens */'];
  
  if (effects.boxShadow) {
    lines.push('  /* Shadows */');
    Object.entries(effects.boxShadow).forEach(([key, value]) => {
      lines.push(`  --shadow-${key}: ${value};`);
    });
  }
  
  return lines.join('\n');
}

function flattenColors(colors: any, prefix = ''): any {
  const result: any = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}-${key}` : key;
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenColors(value, newKey));
    } else {
      result[newKey] = value;
    }
  });
  
  return result;
}

// Main execution
generateTokenFiles().catch(console.error);
```

## Token Validation

### 🚨 CREATE THIS FILE: `scripts/validate-design-tokens.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Validates that all required design tokens are present and properly structured
 * Ensures Figma tokens are complete before component development
 */

import fs from 'fs';
import path from 'path';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

async function validateDesignTokens(): Promise<void> {
  console.log('🎨 VALIDATING DESIGN TOKENS');
  console.log('===========================\n');
  
  const tokenPath = path.join(process.cwd(), 'src/tokens/figma-tokens.json');
  
  // Check if tokens exist
  if (!fs.existsSync(tokenPath)) {
    console.error('❌ No design tokens found!');
    console.error('   Run: npm run extract-figma-tokens');
    process.exit(1);
  }
  
  // Load and validate tokens
  const tokenFile = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  const result = validateTokenStructure(tokenFile.tokens);
  
  // Display results
  if (result.errors.length > 0) {
    console.error('❌ VALIDATION ERRORS:');
    result.errors.forEach(err => console.error(`   - ${err}`));
    console.error('');
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️  WARNINGS:');
    result.warnings.forEach(warn => console.warn(`   - ${warn}`));
    console.warn('');
  }
  
  if (result.valid) {
    console.log('✅ Design tokens are valid and complete!');
    console.log('\n📊 Token Summary:');
    displayTokenSummary(tokenFile.tokens);
  } else {
    console.error('\n🛑 Design token validation failed. Fix errors before proceeding.');
    process.exit(1);
  }
}

function validateTokenStructure(tokens: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required token categories
  const requiredCategories = {
    colors: {
      required: ['neutral', 'interactive', 'primary', 'error'],
      structure: {
        neutral: ['bg-primary', 'bg-secondary', 'text-primary', 'border-strong'],
        interactive: ['bg-bold', 'text-default', 'border-bold']
      }
    },
    spacing: {
      required: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    typography: {
      required: ['fontSize', 'fontWeight', 'lineHeight'],
      structure: {
        fontSize: ['xs', 'sm', 'base', 'lg', 'xl'],
        fontWeight: ['normal', 'medium', 'semibold', 'bold']
      }
    }
  };
  
  // Validate each category
  Object.entries(requiredCategories).forEach(([category, requirements]) => {
    if (!tokens[category]) {
      errors.push(`Missing required token category: ${category}`);
      return;
    }
    
    // Check required keys
    if (requirements.required) {
      requirements.required.forEach(key => {
        if (!tokens[category][key]) {
          errors.push(`Missing required ${category}.${key}`);
        }
      });
    }
    
    // Check structure
    if (requirements.structure) {
      Object.entries(requirements.structure).forEach(([subCategory, requiredKeys]) => {
        if (!tokens[category][subCategory]) {
          errors.push(`Missing ${category}.${subCategory}`);
          return;
        }
        
        requiredKeys.forEach(key => {
          if (!tokens[category][subCategory][key]) {
            errors.push(`Missing ${category}.${subCategory}.${key}`);
          }
        });
      });
    }
  });
  
  // Check for hardcoded values
  const hardcodedColorPattern = /#[0-9a-fA-F]{3,6}|rgb/;
  JSON.stringify(tokens).split('"').forEach((value, index) => {
    if (index % 2 === 1 && hardcodedColorPattern.test(value)) {
      // This is a value (not a key) and contains color
      // Make sure it's a valid hex color
      if (!/^#[0-9a-fA-F]{6}$/.test(value) && !value.startsWith('rgb')) {
        warnings.push(`Invalid color format: ${value}`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function displayTokenSummary(tokens: any) {
  console.log(`   Colors: ${countTokens(tokens.colors)} tokens`);
  console.log(`   Spacing: ${countTokens(tokens.spacing)} tokens`);
  console.log(`   Typography: ${countTokens(tokens.typography)} properties`);
  console.log(`   Effects: ${countTokens(tokens.effects)} tokens`);
  
  // Show token completeness
  console.log('\n📈 Token Coverage:');
  console.log(`   Semantic colors: ${tokens.colors?.neutral ? '✅' : '❌'}`);
  console.log(`   Interactive states: ${tokens.colors?.interactive ? '✅' : '❌'}`);
  console.log(`   Spacing scale: ${tokens.spacing ? '✅' : '❌'}`);
  console.log(`   Typography system: ${tokens.typography ? '✅' : '❌'}`);
}

function countTokens(obj: any): number {
  if (!obj) return 0;
  
  let count = 0;
  Object.values(obj).forEach(value => {
    if (typeof value === 'object') {
      count += countTokens(value);
    } else {
      count++;
    }
  });
  
  return count;
}

// Main execution
validateDesignTokens().catch(console.error);
```

## Rebrand Preview

### 🚨 CREATE THIS FILE: `scripts/preview-rebrand-changes.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Preview what will change when rebranding from current to new Figma tokens
 * Shows before/after comparison without applying changes
 */

import fs from 'fs';
import path from 'path';

async function previewRebrandChanges() {
  console.log('🔍 REBRAND PREVIEW');
  console.log('==================\n');
  
  // Get current tokens
  const currentTokenPath = path.join(process.cwd(), 'src/tokens/figma-tokens.json');
  if (!fs.existsSync(currentTokenPath)) {
    console.error('❌ No current tokens found. Run extract-figma-tokens first.');
    process.exit(1);
  }
  
  const currentTokens = JSON.parse(fs.readFileSync(currentTokenPath, 'utf-8'));
  
  console.log('📥 Extracting new tokens from Figma...\n');
  
  // TODO: Extract new tokens from Figma (would use actual Figma API)
  // For now, simulate with modified tokens
  const newTokens = JSON.parse(JSON.stringify(currentTokens));
  
  // Show differences
  const changes = diff(currentTokens.tokens, newTokens.tokens);
  
  if (Object.keys(changes).length === 0) {
    console.log('✅ No changes detected. Design tokens are up to date.');
    return;
  }
  
  console.log('📊 CHANGES DETECTED:\n');
  
  // Display color changes
  if (changes.colors) {
    console.log('🎨 Color Changes:');
    displayChanges(currentTokens.tokens.colors, newTokens.tokens.colors, '   ');
    console.log('');
  }
  
  // Display spacing changes
  if (changes.spacing) {
    console.log('📏 Spacing Changes:');
    displayChanges(currentTokens.tokens.spacing, newTokens.tokens.spacing, '   ');
    console.log('');
  }
  
  // Display typography changes
  if (changes.typography) {
    console.log('✏️  Typography Changes:');
    displayChanges(currentTokens.tokens.typography, newTokens.tokens.typography, '   ');
    console.log('');
  }
  
  // Show affected components
  console.log('🔧 AFFECTED COMPONENTS:');
  const affectedComponents = await findAffectedComponents(changes);
  affectedComponents.forEach(comp => console.log(`   - ${comp}`));
  
  console.log('\n💡 To apply these changes, run: npm run rebrand');
}

function displayChanges(current: any, updated: any, indent: string = '') {
  const allKeys = new Set([...Object.keys(current || {}), ...Object.keys(updated || {})]);
  
  allKeys.forEach(key => {
    const currentValue = current?.[key];
    const updatedValue = updated?.[key];
    
    if (typeof currentValue === 'object' && typeof updatedValue === 'object') {
      console.log(`${indent}${key}:`);
      displayChanges(currentValue, updatedValue, indent + '  ');
    } else if (currentValue !== updatedValue) {
      if (currentValue === undefined) {
        console.log(`${indent}+ ${key}: ${updatedValue} (NEW)`);
      } else if (updatedValue === undefined) {
        console.log(`${indent}- ${key}: ${currentValue} (REMOVED)`);
      } else {
        console.log(`${indent}~ ${key}: ${currentValue} → ${updatedValue}`);
      }
    }
  });
}

async function findAffectedComponents(changes: any): Promise<string[]> {
  // TODO: Analyze which components use the changed tokens
  // This would scan component files for token usage
  return ['Button', 'Input', 'Card']; // Placeholder
}

// Diff utility (simplified)
function diff(obj1: any, obj2: any): any {
  const result: any = {};
  
  Object.keys(obj2).forEach(key => {
    if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      result[key] = obj2[key];
    }
  });
  
  return result;
}

// Main execution
previewRebrandChanges().catch(console.error);
```

## ✅ Figma Scripts Complete

You should now have created:
- Token extraction script
- Token file generation script
- Token validation script
- Rebrand preview script

Total files created in this step: **4 scripts**

## 📋 Next Step

👉 **Continue to [STEP-4-INSTRUCTIONS.md](./STEP-4-INSTRUCTIONS.md)** for remaining visual verification scripts and documentation files.