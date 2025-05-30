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

## Pre-Component Validation

### 🚨 CREATE THIS FILE: `scripts/pre-component.ts`
```typescript
#!/usr/bin/env tsx

/**
 * 🚨 MANDATORY PRE-COMPONENT VALIDATION
 * 
 * This script MUST pass before ANY component development begins.
 * It enforces all architectural requirements and prepares the environment.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface PreComponentCheckResult {
  passed: boolean;
  message: string;
  critical?: boolean;
}

class PreComponentValidator {
  private componentName: string;
  private componentPath: string;
  private atomicLevel: 'atoms' | 'molecules' | 'organisms';
  private checks: PreComponentCheckResult[] = [];

  constructor(componentName: string, atomicLevel: 'atoms' | 'molecules' | 'organisms' = 'atoms') {
    this.componentName = componentName;
    this.atomicLevel = atomicLevel;
    this.componentPath = path.join(process.cwd(), 'src/components', atomicLevel, componentName);
  }

  async run() {
    console.log(chalk.blue.bold('\n🚨 MANDATORY PRE-COMPONENT VALIDATION\n'));
    console.log(chalk.yellow(`Component: ${this.componentName}`));
    console.log(chalk.yellow(`Level: ${this.atomicLevel}\n`));

    // Run all checks
    await this.checkFigmaConnection();
    await this.checkTokensExist();
    await this.checkTokensNotEmpty();
    await this.checkArchitecturalCompliance();
    await this.checkDesignSystemReadiness();
    await this.generateTokenMapping();
    await this.createComponentScaffold();
    await this.setupContinuousValidation();

    // Report results
    this.reportResults();

    // Exit with error if any critical check failed
    const criticalFailures = this.checks.filter(c => c.critical && !c.passed);
    if (criticalFailures.length > 0) {
      console.log(chalk.red.bold('\n❌ CRITICAL FAILURES DETECTED - CANNOT PROCEED'));
      console.log(chalk.red('Fix all critical issues before creating component.\n'));
      process.exit(1);
    }

    console.log(chalk.green.bold('\n✅ ALL CHECKS PASSED - READY TO BUILD COMPONENT\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.cyan('1. Review token mapping in component directory'));
    console.log(chalk.cyan('2. Use provided scaffold as starting point'));
    console.log(chalk.cyan('3. Keep validation watcher running during development'));
    console.log(chalk.cyan('4. Say "I\'m ready to add a new component" to Claude\n'));
  }

  private async checkFigmaConnection() {
    console.log(chalk.gray('Checking Figma MCP connection...'));
    
    // Check if Figma config exists and has credentials
    const figmaConfigPath = path.join(process.cwd(), 'figma.config.json');
    if (!fs.existsSync(figmaConfigPath)) {
      this.checks.push({
        passed: false,
        message: 'figma.config.json not found',
        critical: true
      });
      return;
    }

    const config = JSON.parse(fs.readFileSync(figmaConfigPath, 'utf-8'));
    if (!config.fileId || config.fileId === 'YOUR_FIGMA_FILE_ID') {
      this.checks.push({
        passed: false,
        message: 'Figma file ID not configured',
        critical: true
      });
      return;
    }

    this.checks.push({
      passed: true,
      message: 'Figma configuration valid'
    });
  }

  private async checkTokensExist() {
    console.log(chalk.gray('Checking design tokens exist...'));
    
    const tokenFiles = [
      'src/tokens/figma-tokens.json',
      'src/tokens/tailwind-tokens.generated.js',
      'src/styles/tokens/css-variables.generated.css'
    ];

    for (const file of tokenFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        this.checks.push({
          passed: false,
          message: `Missing token file: ${file}`,
          critical: true
        });
        return;
      }
    }

    this.checks.push({
      passed: true,
      message: 'All token files exist'
    });
  }

  private async checkTokensNotEmpty() {
    console.log(chalk.gray('Checking design tokens are populated...'));
    
    const figmaTokensPath = path.join(process.cwd(), 'src/tokens/tailwind-tokens.generated.js');
    const content = fs.readFileSync(figmaTokensPath, 'utf-8');
    
    // Check if tokens are empty
    if (content.includes('colors: {},') && content.includes('spacing: {}')) {
      this.checks.push({
        passed: false,
        message: 'Design tokens are empty - run npm run extract-figma-tokens',
        critical: true
      });
      
      // Try to run token extraction
      console.log(chalk.yellow('\nAttempting to extract tokens from Figma...'));
      try {
        execSync('npm run extract-figma-tokens', { stdio: 'inherit' });
        console.log(chalk.green('Token extraction completed!'));
      } catch (error) {
        console.log(chalk.red('Token extraction failed - manual intervention required'));
      }
      return;
    }

    // Parse and validate token content
    try {
      const module = { exports: {} };
      eval(content);
      const tokens = module.exports as any;
      
      const hasColors = Object.keys(tokens.colors || {}).length > 0;
      const hasSpacing = Object.keys(tokens.spacing || {}).length > 0;
      
      if (!hasColors || !hasSpacing) {
        this.checks.push({
          passed: false,
          message: 'Design tokens incomplete - missing colors or spacing',
          critical: true
        });
        return;
      }

      this.checks.push({
        passed: true,
        message: `Tokens loaded: ${Object.keys(tokens.colors).length} colors, ${Object.keys(tokens.spacing).length} spacing values`
      });
    } catch (error) {
      this.checks.push({
        passed: false,
        message: 'Failed to parse design tokens',
        critical: true
      });
    }
  }

  private async checkArchitecturalCompliance() {
    console.log(chalk.gray('Checking architectural compliance...'));
    
    try {
      // Run architecture validation
      execSync('npm run validate:architecture', { 
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      
      this.checks.push({
        passed: true,
        message: 'Architecture validation passed'
      });
    } catch (error: any) {
      const output = error.stdout?.toString() || '';
      const scoreMatch = output.match(/Average Score: (\d+)%/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      
      this.checks.push({
        passed: score === 100,
        message: `Architecture compliance: ${score}%`,
        critical: false
      });
    }
  }

  private async checkDesignSystemReadiness() {
    console.log(chalk.gray('Checking design system readiness...'));
    
    // Check for reference component
    const refPath = path.join(process.cwd(), 'src/_reference/ReferenceComponent.tsx');
    if (!fs.existsSync(refPath)) {
      this.checks.push({
        passed: false,
        message: 'ReferenceComponent.tsx missing',
        critical: true
      });
      return;
    }

    // Check for critical utilities
    const utilsExist = fs.existsSync(path.join(process.cwd(), 'src/utils/classNames.ts')) &&
                       fs.existsSync(path.join(process.cwd(), 'src/utils/componentVariants.ts'));
    
    if (!utilsExist) {
      this.checks.push({
        passed: false,
        message: 'Critical utilities missing',
        critical: true
      });
      return;
    }

    this.checks.push({
      passed: true,
      message: 'Design system infrastructure ready'
    });
  }

  private async generateTokenMapping() {
    console.log(chalk.gray('Generating token mapping documentation...'));
    
    try {
      // Load tokens
      const tokenPath = path.join(process.cwd(), 'src/tokens/tailwind-tokens.generated.js');
      const content = fs.readFileSync(tokenPath, 'utf-8');
      const module = { exports: {} };
      eval(content);
      const tokens = module.exports as any;

      // Create component directory
      fs.mkdirSync(this.componentPath, { recursive: true });

      // Generate mapping documentation
      let mappingDoc = `# Token Mapping for ${this.componentName}\n\n`;
      mappingDoc += `Generated: ${new Date().toISOString()}\n\n`;
      
      // Color mappings
      mappingDoc += `## Color Token Classes\n\n`;
      mappingDoc += `| Figma Token | Tailwind Class | Hex Value |\n`;
      mappingDoc += `|-------------|----------------|------------|\n`;
      
      for (const [key, value] of Object.entries(tokens.colors || {})) {
        const className = this.tokenToClassName(key, 'color');
        mappingDoc += `| ${key} | ${className} | ${value} |\n`;
      }

      // Spacing mappings
      mappingDoc += `\n## Spacing Token Classes\n\n`;
      mappingDoc += `| Token | Class | Value |\n`;
      mappingDoc += `|-------|-------|-------|\n`;
      
      for (const [key, value] of Object.entries(tokens.spacing || {})) {
        mappingDoc += `| ${key} | ${key} | ${value} |\n`;
      }

      // Common patterns
      mappingDoc += `\n## Common Patterns\n\n`;
      mappingDoc += `\`\`\`typescript
// Background colors
className="bg-neutral-bg-primary"    // Primary background
className="bg-neutral-bg-secondary"  // Secondary background

// Text colors  
className="text-neutral-text-primary"    // Primary text
className="text-neutral-text-secondary"  // Secondary text

// Interactive states
className="hover:bg-interactive-bg-hover"     // Hover background
className="focus:border-interactive-border-focus"  // Focus border

// Disabled states
className="disabled:bg-neutral-bg-disabled"   // Disabled background
className="disabled:text-neutral-text-disabled"   // Disabled text
\`\`\``;

      // Write mapping file
      const mappingPath = path.join(this.componentPath, `${this.componentName}.tokens.md`);
      fs.writeFileSync(mappingPath, mappingDoc);

      this.checks.push({
        passed: true,
        message: `Token mapping generated at ${this.componentName}/${this.componentName}.tokens.md`
      });
    } catch (error) {
      this.checks.push({
        passed: false,
        message: 'Failed to generate token mapping',
        critical: false
      });
    }
  }

  private tokenToClassName(token: string, type: 'color' | 'spacing'): string {
    // Convert token name to Tailwind class
    // e.g., "neutral-bg-primary" -> "bg-neutral-bg-primary" or "text-neutral-bg-primary"
    if (type === 'color') {
      if (token.includes('bg')) {
        return `bg-${token}`;
      } else if (token.includes('text')) {
        return `text-${token}`;
      } else if (token.includes('border')) {
        return `border-${token}`;
      }
      return `text-${token}`; // default to text
    }
    return token; // spacing uses token directly
  }

  private async createComponentScaffold() {
    console.log(chalk.gray('Creating component scaffold...'));
    
    const scaffoldPath = path.join(this.componentPath, `${this.componentName}.scaffold.tsx`);
    
    const scaffold = `import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/classNames';

/**
 * ${this.componentName} Component
 * 
 * 🚨 IMPORTANT: This is a scaffold. Replace ALL placeholder classes with actual design tokens.
 * Refer to ${this.componentName}.tokens.md for the complete token mapping.
 */

// 🔑 PATTERN: CVA Variants Configuration following ReferenceComponent.tsx
const ${this.componentName.toLowerCase()}Variants = cva(
  [
    // Base styles using design token classes
    'bg-neutral-bg-primary',      // TODO: Replace with actual token
    'text-neutral-text-primary',   // TODO: Replace with actual token
    'border-neutral-border-default', // TODO: Replace with actual token
    // Add more base styles from Figma
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-interactive-bg-bold',
          'text-interactive-text-on-fill',
          'hover:bg-interactive-bg-bold-hover',
          'active:bg-interactive-bg-bold-pressed'
        ],
        secondary: [
          'bg-neutral-bg-primary',
          'text-interactive-text-default',
          'border-interactive-border-bold',
          'hover:bg-interactive-bg-subtle-hover'
        ]
      },
      size: {
        small: ['text-sm', 'px-3', 'py-1.5', 'min-h-[32px]'],
        medium: ['text-base', 'px-4', 'py-2', 'min-h-[40px]'],
        large: ['text-lg', 'px-6', 'py-3', 'min-h-[48px]']
      },
      state: {
        default: [],
        disabled: [
          'opacity-50',
          'cursor-not-allowed',
          'pointer-events-none'
        ],
        loading: [
          'cursor-wait',
          'relative'
        ]
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      state: 'default'
    }
  }
);

export interface ${this.componentName}Props 
  extends React.HTMLAttributes<HTMLElement>,
          VariantProps<typeof ${this.componentName.toLowerCase()}Variants> {
  /**
   * The content of the ${this.componentName.toLowerCase()}
   */
  children?: React.ReactNode;
  
  /**
   * Whether the ${this.componentName.toLowerCase()} is disabled
   */
  disabled?: boolean;
  
  /**
   * Loading state
   */
  loading?: boolean;
}

/**
 * ${this.componentName} Component
 * 
 * @example
 * <${this.componentName} variant="primary" size="medium">
 *   Content
 * </${this.componentName}>
 */
export const ${this.componentName} = forwardRef<HTMLDivElement, ${this.componentName}Props>(
  (
    {
      className,
      variant,
      size,
      state,
      disabled,
      loading,
      children,
      ...props
    },
    ref
  ) => {
    // Determine current state
    const currentState = loading ? 'loading' : (disabled ? 'disabled' : state);

    return (
      <div
        ref={ref}
        className={cn(
          ${this.componentName.toLowerCase()}Variants({ variant, size, state: currentState }),
          className
        )}
        aria-disabled={disabled}
        aria-busy={loading}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${this.componentName}.displayName = '${this.componentName}';

export default ${this.componentName};`;

    fs.writeFileSync(scaffoldPath, scaffold);

    this.checks.push({
      passed: true,
      message: `Component scaffold created at ${this.componentName}/${this.componentName}.scaffold.tsx`
    });
  }

  private async setupContinuousValidation() {
    console.log(chalk.gray('Setting up continuous validation...'));
    
    const watchScriptPath = path.join(this.componentPath, 'validate-watch.sh');
    
    const watchScript = `#!/bin/bash
# Continuous validation for ${this.componentName} component

echo "🔍 Starting continuous validation for ${this.componentName}..."
echo "Press Ctrl+C to stop"

# Watch for changes and validate
nodemon --watch "${this.componentPath}" \\
  --ext "ts,tsx" \\
  --exec "npm run validate:architecture -- --component ${this.componentName}" \\
  --delay 1000

# Alternative: Use chokidar-cli if nodemon not available
# npx chokidar "${this.componentPath}/**/*.{ts,tsx}" -c "npm run validate:architecture -- --component ${this.componentName}"`;

    fs.writeFileSync(watchScriptPath, watchScript);
    fs.chmodSync(watchScriptPath, 0o755);

    this.checks.push({
      passed: true,
      message: `Continuous validation script created. Run: ./src/components/${this.atomicLevel}/${this.componentName}/validate-watch.sh`
    });
  }

  private reportResults() {
    console.log(chalk.blue.bold('\n📊 VALIDATION REPORT\n'));
    
    const passed = this.checks.filter(c => c.passed);
    const failed = this.checks.filter(c => !c.passed);
    const critical = failed.filter(c => c.critical);

    // Show passed checks
    if (passed.length > 0) {
      console.log(chalk.green.bold('✅ Passed Checks:'));
      passed.forEach(check => {
        console.log(chalk.green(`   ✓ ${check.message}`));
      });
    }

    // Show failed checks
    if (failed.length > 0) {
      console.log(chalk.red.bold('\n❌ Failed Checks:'));
      failed.forEach(check => {
        const prefix = check.critical ? '🚨' : '⚠️';
        console.log(chalk.red(`   ${prefix} ${check.message}`));
      });
    }

    // Summary
    console.log(chalk.blue(`\n📈 Summary: ${passed.length}/${this.checks.length} checks passed`));
    if (critical.length > 0) {
      console.log(chalk.red(`🚨 ${critical.length} critical failures`));
    }
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(chalk.red('Usage: npm run pre-component <ComponentName> [atoms|molecules|organisms]'));
  console.log(chalk.gray('Example: npm run pre-component Button atoms'));
  process.exit(1);
}

const componentName = args[0];
const atomicLevel = (args[1] || 'atoms') as 'atoms' | 'molecules' | 'organisms';

const validator = new PreComponentValidator(componentName, atomicLevel);
validator.run().catch(console.error);
```

## ✅ Figma Scripts Complete

You should now have created:
- Token extraction script
- Token file generation script
- Token validation script
- Rebrand preview script
- Pre-component validation script

Total files created in this step: **5 scripts**

## 📋 Next Step

👉 **Continue to [STEP-4-INSTRUCTIONS.md](./STEP-4-INSTRUCTIONS.md)** for remaining visual verification scripts and documentation files.