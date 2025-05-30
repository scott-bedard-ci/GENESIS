# STEP 2: Validation Scripts

This step creates all validation and setup scripts. These are CRITICAL - the system won't work without them.

## Component Architecture Validation

### 🚨 CREATE THIS FILE: `scripts/validate-component-architecture.ts`
```typescript
#!/usr/bin/env tsx

/**
 * 🔑 ARCHITECTURAL COMPLIANCE VALIDATOR
 * 
 * This script MUST pass before any component can be created or modified.
 * It enforces the mandatory CVA + Tailwind pattern for all components.
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ValidationResult {
  file: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100 compliance score
}

// 🚨 MANDATORY PATTERNS - Every component MUST have these
const REQUIRED_PATTERNS = [
  {
    pattern: /import.*cva.*from ['"]class-variance-authority['"]/,
    error: 'Missing CVA import: import { cva, type VariantProps } from "class-variance-authority"',
    weight: 25
  },
  {
    pattern: /const \w+Variants = cva\(/,
    error: 'Missing CVA configuration: const componentVariants = cva(...)',
    weight: 25
  },
  {
    pattern: /VariantProps<typeof \w+Variants>/,
    error: 'Missing VariantProps integration in TypeScript interface',
    weight: 25
  },
  {
    pattern: /forwardRef</,
    error: 'Missing forwardRef usage - Components must use React.forwardRef',
    weight: 25
  }
];

// 🚨 FORBIDDEN PATTERNS - These break architectural standards
const FORBIDDEN_PATTERNS = [
  {
    pattern: /style=\{[\s\S]*?\}/g,
    message: '❌ FORBIDDEN: Inline styles with style={{}} - Use CVA + Tailwind classes'
  },
  {
    pattern: /import.*(?:semanticColors|colors).*from.*['"].*tokens/g,
    message: '❌ FORBIDDEN: Direct token imports for styling - Use design token classes'
  },
  {
    pattern: /#[0-9a-fA-F]{6}(?![0-9a-fA-F])|#[0-9a-fA-F]{3}(?![0-9a-fA-F])/g,
    message: '❌ FORBIDDEN: Hardcoded hex colors - Use design token classes'
  },
  {
    pattern: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,
    message: '❌ FORBIDDEN: Hardcoded rgb/rgba colors - Use design token classes'
  },
  {
    pattern: /(?:className|class)=["'][^"']*(?:bg-|text-|border-)(?:red|blue|green|yellow|purple|pink|gray)-\d+/g,
    message: '❌ FORBIDDEN: Hardcoded Tailwind colors - Use design token classes'
  }
];

// Required design token classes
const REQUIRED_TOKEN_CLASSES = [
  'neutral-bg-primary',
  'neutral-text-primary',
  'interactive-bg-bold',
  'interactive-text-on-fill',
  'interactive-border-bold'
];

async function validateComponent(filePath: string): Promise<ValidationResult> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;
  
  // Skip validation for specific files
  if (content.includes('// Skip architecture validation')) {
    return { file: filePath, passed: true, errors: [], warnings: [], score: 100 };
  }
  
  // Check for required patterns
  REQUIRED_PATTERNS.forEach(({ pattern, error, weight }) => {
    if (!pattern.test(content)) {
      errors.push(error);
      score -= weight;
    }
  });
  
  // Check for forbidden patterns
  FORBIDDEN_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      const unique = [...new Set(matches)].slice(0, 3);
      errors.push(`${message}. Found: ${unique.join(', ')}${matches.length > 3 ? '...' : ''}`);
      score = Math.max(0, score - 10);
    }
  });
  
  // Check for design token class usage
  const hasTokenClasses = REQUIRED_TOKEN_CLASSES.some(tokenClass => 
    content.includes(tokenClass)
  );
  
  if (!hasTokenClasses) {
    warnings.push('No design token classes detected. Use classes like bg-neutral-bg-primary, text-interactive-text-default');
    score = Math.max(0, score - 5);
  }
  
  // Check component structure
  if (!content.includes('.displayName')) {
    warnings.push('Missing displayName for component');
  }
  
  return {
    file: filePath,
    passed: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}

async function validateReferenceImplementation(): Promise<boolean> {
  const referencePath = 'src/_reference/ReferenceComponent.tsx';
  
  if (!fs.existsSync(referencePath)) {
    console.error('\n🚨 CRITICAL ERROR: Reference implementation missing!');
    console.error('ReferenceComponent.tsx must exist as the canonical pattern.');
    console.error('Run: npm run setup:reference-implementation');
    return false;
  }
  
  const result = await validateComponent(referencePath);
  if (!result.passed || result.score < 100) {
    console.error('\n🚨 CRITICAL ERROR: Reference implementation is not compliant!');
    console.error('ReferenceComponent.tsx must be 100% compliant as the canonical pattern.');
    return false;
  }
  
  console.log('✅ Reference implementation (ReferenceComponent.tsx) validated');
  return true;
}

async function main() {
  console.log('🏗️  VALIDATING ARCHITECTURAL COMPLIANCE');
  console.log('=====================================\n');
  
  // First validate reference implementation
  const referenceValid = await validateReferenceImplementation();
  if (!referenceValid) {
    process.exit(1);
  }
  
  const componentFiles = await glob('src/components/**/*.tsx', { 
    ignore: ['**/*.stories.tsx', '**/*.test.tsx', '**/index.ts'] 
  });
  
  if (componentFiles.length === 0) {
    console.log('✅ No components found - ready for development');
    console.log('\n📚 Reference: src/_reference/ReferenceComponent.tsx');
    return;
  }
  
  const results: ValidationResult[] = [];
  let totalScore = 0;
  
  for (const file of componentFiles) {
    const result = await validateComponent(file);
    results.push(result);
    totalScore += result.score;
    
    const status = result.passed ? '✅' : '❌';
    const scoreColor = result.score === 100 ? '32' : result.score >= 80 ? '33' : '31';
    console.log(`${status} ${path.relative(process.cwd(), file)} \x1b[${scoreColor}m[${result.score}%]\x1b[0m`);
    
    if (result.errors.length > 0) {
      result.errors.forEach(error => console.log(`   🚨 ${error}`));
    }
    
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
    }
    
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log('');
    }
  }
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const averageScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;
  
  console.log(`\n📊 ARCHITECTURAL COMPLIANCE REPORT:`);
  console.log(`   ✅ Compliant: ${passedCount}/${totalCount}`);
  console.log(`   ❌ Non-compliant: ${totalCount - passedCount}/${totalCount}`);
  console.log(`   📈 Average Score: ${averageScore}%`);
  
  if (passedCount === totalCount && averageScore === 100) {
    console.log('\n🎉 PERFECT ARCHITECTURAL COMPLIANCE!');
    console.log('All components follow the mandatory CVA + Tailwind pattern.');
    process.exit(0);
  } else {
    console.log('\n🚨 ARCHITECTURAL VIOLATIONS DETECTED');
    console.log('\n🛑 MANDATORY ACTIONS:');
    console.log('1. Fix all violations before proceeding');
    console.log('2. Reference ReferenceComponent.tsx for the correct pattern');
    console.log('3. Run validation again: npm run validate:architecture');
    console.log('\n📚 Documentation: docs/component-architecture-pattern.md');
    process.exit(1);
  }
}

main().catch(console.error);
```

## Rebrand Capability Validation

### 🚨 CREATE THIS FILE: `scripts/validate-rebrand-capability.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Validates that the design system maintains rebrand capability
 * Ensures no hardcoded values exist that would break instant rebrand
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface RebrandValidation {
  isRebrandReady: boolean;
  issues: {
    hardcodedColors: string[];
    directTokenImports: string[];
    inlineStyles: string[];
    untracedValues: string[];
  };
  score: number; // 0-100
}

async function validateRebrandCapability(): Promise<RebrandValidation> {
  console.log('🎨 VALIDATING REBRAND CAPABILITY');
  console.log('================================\n');
  
  const issues = {
    hardcodedColors: [],
    directTokenImports: [],
    inlineStyles: [],
    untracedValues: []
  };
  
  // Get all source files
  const sourceFiles = await glob('src/**/*.{ts,tsx,css}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.generated.*', 'src/tokens/**']
  });
  
  // Check each file
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for hardcoded colors
    const hexColors = content.match(/#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])/g);
    if (hexColors) {
      issues.hardcodedColors.push(`${file}: ${hexColors.join(', ')}`);
    }
    
    // Check for rgb/rgba colors
    const rgbColors = content.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g);
    if (rgbColors) {
      issues.hardcodedColors.push(`${file}: ${rgbColors.join(', ')}`);
    }
    
    // Check for direct token imports
    if (content.includes("from '../tokens/") || 
        content.includes('from "../tokens/') ||
        content.includes("from '@/tokens/")) {
      issues.directTokenImports.push(file);
    }
    
    // Check for inline styles
    const inlineStyles = content.match(/style=\{[\s\S]*?\}/g);
    if (inlineStyles) {
      issues.inlineStyles.push(file);
    }
  }
  
  // Calculate score
  const totalIssues = 
    issues.hardcodedColors.length +
    issues.directTokenImports.length +
    issues.inlineStyles.length +
    issues.untracedValues.length;
  
  const score = Math.max(0, 100 - (totalIssues * 5));
  const isRebrandReady = totalIssues === 0;
  
  // Report results
  console.log('📊 REBRAND CAPABILITY REPORT:');
  console.log(`   Score: ${score}/100`);
  console.log(`   Status: ${isRebrandReady ? '✅ REBRAND READY' : '❌ NOT REBRAND READY'}`);
  
  if (!isRebrandReady) {
    console.log('\n🚨 ISSUES FOUND:');
    
    if (issues.hardcodedColors.length > 0) {
      console.log(`\n❌ Hardcoded Colors (${issues.hardcodedColors.length}):`);
      issues.hardcodedColors.forEach(issue => console.log(`   ${issue}`));
    }
    
    if (issues.directTokenImports.length > 0) {
      console.log(`\n❌ Direct Token Imports (${issues.directTokenImports.length}):`);
      issues.directTokenImports.forEach(issue => console.log(`   ${issue}`));
    }
    
    if (issues.inlineStyles.length > 0) {
      console.log(`\n❌ Inline Styles (${issues.inlineStyles.length}):`);
      issues.inlineStyles.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log('\n🛑 FIX ALL ISSUES TO MAINTAIN REBRAND CAPABILITY');
  } else {
    console.log('\n🎉 Design system is fully rebrand-ready!');
    console.log('   ✅ No hardcoded values found');
    console.log('   ✅ All values traced to Figma tokens');
    console.log('   ✅ Instant rebrand capability maintained');
  }
  
  return {
    isRebrandReady,
    issues,
    score
  };
}

// Main execution
validateRebrandCapability().then(result => {
  process.exit(result.isRebrandReady ? 0 : 1);
}).catch(console.error);
```

## Reference Implementation Setup

### 🚨 CREATE THIS FILE: `scripts/setup-reference-implementation.ts`
```typescript
#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

const REFERENCE_COMPONENT = `import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/classNames';

/**
 * 🔑 REFERENCE COMPONENT - THE CANONICAL PATTERN
 * 
 * This component exists ONLY to demonstrate the correct architecture.
 * It is NOT a real component and should NEVER be used in production.
 * 
 * ALL components in the design system MUST follow this exact pattern.
 * When in doubt, refer to this file for the correct implementation.
 * 
 * Key Requirements Demonstrated:
 * 1. CVA for variant management
 * 2. Design token classes only (no hardcoded values)
 * 3. forwardRef for ref forwarding
 * 4. TypeScript with VariantProps
 * 5. Proper file structure and exports
 */

// 🔑 PATTERN: CVA Variants Configuration
const referenceVariants = cva(
  [
    // Base styles using design token classes
    'inline-flex items-center justify-center',
    'font-semibold transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:cursor-not-allowed'
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-interactive-bg-bold text-interactive-text-on-fill',
          'hover:bg-interactive-bg-bold-hover',
          'active:bg-interactive-bg-bold-pressed',
          'focus-visible:ring-primary-500',
          'disabled:bg-interactive-border-disabled disabled:text-interactive-text-disabled'
        ],
        secondary: [
          'bg-neutral-bg-primary text-interactive-text-default',
          'border border-interactive-border-bold',
          'hover:bg-neutral-bg-secondary',
          'active:bg-neutral-bg-tertiary',
          'focus-visible:ring-primary-500',
          'disabled:bg-neutral-bg-primary disabled:text-interactive-text-disabled disabled:border-interactive-border-disabled'
        ],
        destructive: [
          'bg-error-500 text-interactive-text-on-fill',
          'hover:bg-error-600',
          'active:bg-error-700',
          'focus-visible:ring-error-500',
          'disabled:bg-interactive-border-disabled disabled:text-interactive-text-disabled'
        ]
      },
      size: {
        small: ['text-sm px-3 py-1.5 h-8 min-w-[64px]'],
        medium: ['text-sm px-4 py-2 h-10 min-w-[80px]'],
        large: ['text-base px-6 py-3 h-12 min-w-[96px]']
      },
      fullWidth: {
        true: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      fullWidth: false
    }
  }
);

export interface ReferenceComponentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
          VariantProps<typeof referenceVariants> {
  /**
   * The content to display inside the component
   */
  children: React.ReactNode;
}

/**
 * ReferenceComponent - The canonical pattern for all components
 * 
 * @example
 * <ReferenceComponent variant="primary" size="medium">
 *   Content
 * </ReferenceComponent>
 */
export const ReferenceComponent = forwardRef<HTMLDivElement, ReferenceComponentProps>(
  (
    {
      variant,
      size,
      fullWidth,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          referenceVariants({ variant, size, fullWidth }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ReferenceComponent.displayName = 'ReferenceComponent';

export default ReferenceComponent;`;

const REFERENCE_README = `# 🔑 Reference Implementation Directory

## ⚠️ CRITICAL: This is NOT a Production Component

This directory contains the **canonical reference implementation** that ALL components in the Pigment-Genesis design system MUST follow. The ReferenceComponent exists solely to demonstrate the correct architectural pattern.

## Purpose

The ReferenceComponent.tsx file serves as:
1. **The Single Source of Truth** for component architecture
2. **The Validation Baseline** that all components are measured against
3. **The Teaching Example** for new developers
4. **The Unchangeable Pattern** that ensures consistency

## What This Directory Contains

### ReferenceComponent.tsx
- Demonstrates the MANDATORY CVA + Tailwind pattern
- Shows proper TypeScript interface structure
- Illustrates correct forwardRef usage
- Examples all required design token classes
- Includes comprehensive inline documentation

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
   \`\`\`typescript
   import { cva, type VariantProps } from 'class-variance-authority';
   const componentVariants = cva([...], { variants: {...} });
   \`\`\`

2. **Design Token Classes Only**
   - NO hardcoded colors (\`#hex\`, \`rgb()\`)
   - NO arbitrary values (\`p-[12px]\`)
   - NO Tailwind color utilities (\`bg-blue-500\`)
   - ONLY token classes (\`bg-interactive-bg-bold\`)

3. **TypeScript with VariantProps**
   \`\`\`typescript
   interface ComponentProps extends VariantProps<typeof componentVariants> {}
   \`\`\`

4. **ForwardRef Implementation**
   \`\`\`typescript
   export const Component = forwardRef<HTMLElement, ComponentProps>(...);
   \`\`\`

## Validation

This reference implementation:
- Scores 100% on architectural validation
- Contains zero forbidden patterns
- Uses only design token classes
- Follows all TypeScript best practices
- Includes proper display name

Run validation to confirm:
\`\`\`bash
npm run validate:architecture
\`\`\`

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

Remember: **Consistency is more important than any individual optimization.**`;

async function createReferenceImplementation() {
  console.log('🔧 Creating reference implementation...\n');

  // Create reference directory (underscore prefix to sort first)
  const referenceDir = path.join(process.cwd(), 'src/_reference');
  fs.mkdirSync(referenceDir, { recursive: true });

  // Write ReferenceComponent
  fs.writeFileSync(
    path.join(referenceDir, 'ReferenceComponent.tsx'), 
    REFERENCE_COMPONENT
  );
  console.log('✅ Created ReferenceComponent.tsx');

  // Write README for reference
  fs.writeFileSync(
    path.join(referenceDir, 'README.md'), 
    REFERENCE_README
  );
  console.log('✅ Created README.md');

  // Create .gitkeep to ensure directory is tracked
  fs.writeFileSync(
    path.join(referenceDir, '.gitkeep'), 
    ''
  );

  console.log('\n🎉 Reference implementation created successfully!');
  console.log('📚 Location: src/_reference/ReferenceComponent.tsx');
  console.log('📋 This is the canonical pattern ALL components must follow.');
}

// Create utils first
const utilsDir = path.join(process.cwd(), 'src/utils');
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
}

// Create classNames utility
fs.writeFileSync(
  path.join(utilsDir, 'classNames.ts'),
  `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for constructing className strings conditionally.
 * Combines clsx and tailwind-merge for optimal Tailwind CSS class handling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
);

createReferenceImplementation().catch(console.error);
```

## Setup Validation System

### 🚨 CREATE THIS FILE: `scripts/setup-validation.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Sets up all validation systems for the design system
 * Ensures all validation scripts and hooks are properly configured
 */

import fs from 'fs';
import path from 'path';

async function setupValidation() {
  console.log('🔧 SETTING UP VALIDATION SYSTEMS');
  console.log('================================\n');
  
  // Create git hooks directory
  const hooksDir = path.join(process.cwd(), '.git/hooks');
  fs.mkdirSync(hooksDir, { recursive: true });
  
  // Create pre-commit hook
  const preCommitHook = `#!/bin/sh
# Pre-commit validation hook

echo "🔍 Running pre-commit validation..."

# Run architectural validation
npm run validate:architecture
if [ $? -ne 0 ]; then
  echo "❌ Architectural validation failed. Fix issues before committing."
  exit 1
fi

# Run token validation
npm run validate:tokens
if [ $? -ne 0 ]; then
  echo "❌ Design token validation failed. Fix issues before committing."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix issues before committing."
  exit 1
fi

echo "✅ All validations passed!"
`;
  
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  fs.writeFileSync(preCommitPath, preCommitHook);
  fs.chmodSync(preCommitPath, '755');
  console.log('✅ Created pre-commit hook');
  
  // Create validation summary script
  const validationSummary = path.join(process.cwd(), '.validation-summary.json');
  fs.writeFileSync(validationSummary, JSON.stringify({
    lastRun: new Date().toISOString(),
    validations: {
      architecture: { script: 'validate:architecture', required: true },
      tokens: { script: 'validate:tokens', required: true },
      visual: { script: 'validate:visual', required: false },
      rebrand: { script: 'rebrand:validate', required: true }
    }
  }, null, 2));
  console.log('✅ Created validation summary');
  
  // Create VS Code tasks
  const vscodeDir = path.join(process.cwd(), '.vscode');
  fs.mkdirSync(vscodeDir, { recursive: true });
  
  const tasks = {
    version: '2.0.0',
    tasks: [
      {
        label: 'Validate All',
        type: 'npm',
        script: 'validate:all',
        group: {
          kind: 'test',
          isDefault: true
        },
        problemMatcher: []
      },
      {
        label: 'Validate Architecture',
        type: 'npm',
        script: 'validate:architecture',
        problemMatcher: []
      },
      {
        label: 'Visual Verification',
        type: 'npm',
        script: 'visual-verify',
        problemMatcher: []
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(vscodeDir, 'tasks.json'),
    JSON.stringify(tasks, null, 2)
  );
  console.log('✅ Created VS Code tasks');
  
  console.log('\n🎉 Validation systems set up successfully!');
  console.log('\nAvailable validations:');
  console.log('  npm run validate:all        - Run all validations');
  console.log('  npm run validate:architecture - Check architectural compliance');
  console.log('  npm run validate:tokens     - Validate design tokens');
  console.log('  npm run validate:visual     - Check visual compliance');
  console.log('  npm run rebrand:validate    - Verify rebrand capability');
}

// Main execution
setupValidation().catch(console.error);
```

## ✅ Validation Scripts Complete

You should now have created:
- Component architecture validation script
- Rebrand capability validation script
- Reference implementation setup script
- Validation system setup script

Total files created in this step: **4 scripts + 2 reference files = 6**

## 📋 Next Step

👉 **Continue to [STEP-3-FIGMA-SCRIPTS.md](./STEP-3-FIGMA-SCRIPTS.md)**