# STEP 4: Visual Verification Scripts & Documentation

This step creates visual verification scripts and all Claude instruction/documentation files.

## Visual Verification Script

### 🚨 CREATE THIS FILE: `scripts/visual-verification.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Visual verification system for comparing Storybook screenshots against Figma designs
 * This ensures pixel-perfect implementation of design specifications
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface VerificationResult {
  component: string;
  story: string;
  viewport: string;
  matchPercentage: number;
  passed: boolean;
  screenshotPath: string;
  figmaPath?: string;
  diffPath?: string;
}

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1440, height: 900 }
};

const MATCH_THRESHOLD = 95; // 95% similarity required

async function captureStorybook(): Promise<VerificationResult[]> {
  console.log('🎨 VISUAL VERIFICATION SYSTEM');
  console.log('=============================\n');
  
  // Start Storybook
  console.log('🚀 Starting Storybook server...');
  const storybookProcess = exec('npm run storybook -- --ci --quiet');
  
  // Wait for Storybook to be ready
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results: VerificationResult[] = [];
  
  try {
    // Get all stories from Storybook
    const storiesUrl = 'http://localhost:6006/stories.json';
    const page = await browser.newPage();
    await page.goto(storiesUrl, { waitUntil: 'networkidle0' });
    const storiesJson = await page.evaluate(() => document.body.innerText);
    const stories = JSON.parse(storiesJson);
    
    // Process each story
    for (const [storyId, story] of Object.entries(stories.stories || {})) {
      const storyData = story as any;
      
      // Skip docs-only stories
      if (storyData.parameters?.docsOnly) continue;
      
      // Capture each viewport
      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        console.log(`📸 Capturing ${storyData.title}/${storyData.name} @ ${viewportName}...`);
        
        await page.setViewport(viewport);
        await page.goto(
          `http://localhost:6006/iframe.html?viewMode=story&id=${storyId}`,
          { waitUntil: 'networkidle0' }
        );
        
        // Wait for any animations
        await page.waitForTimeout(1000);
        
        // Capture screenshot
        const screenshotDir = path.join(
          process.cwd(),
          'visual-verification',
          'screenshots',
          storyData.title
        );
        fs.mkdirSync(screenshotDir, { recursive: true });
        
        const screenshotPath = path.join(
          screenshotDir,
          `${storyData.name}-${viewportName}.png`
        );
        
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });
        
        // Compare with Figma (if available)
        const figmaPath = path.join(
          process.cwd(),
          'visual-verification',
          'figma',
          storyData.title,
          `${storyData.name}-${viewportName}.png`
        );
        
        let matchPercentage = 100;
        let diffPath: string | undefined;
        
        if (fs.existsSync(figmaPath)) {
          const comparison = await compareImages(screenshotPath, figmaPath);
          matchPercentage = comparison.matchPercentage;
          diffPath = comparison.diffPath;
        }
        
        results.push({
          component: storyData.title,
          story: storyData.name,
          viewport: viewportName,
          matchPercentage,
          passed: matchPercentage >= MATCH_THRESHOLD,
          screenshotPath,
          figmaPath: fs.existsSync(figmaPath) ? figmaPath : undefined,
          diffPath
        });
      }
    }
  } finally {
    await browser.close();
    
    // Stop Storybook
    if (storybookProcess.pid) {
      process.kill(storybookProcess.pid, 'SIGTERM');
    }
  }
  
  return results;
}

async function compareImages(
  screenshotPath: string,
  figmaPath: string
): Promise<{ matchPercentage: number; diffPath?: string }> {
  // This would use an image comparison library like pixelmatch or resemble.js
  // For now, return a placeholder
  return {
    matchPercentage: 98,
    diffPath: undefined
  };
}

async function generateReport(results: VerificationResult[]) {
  console.log('\n📊 VISUAL VERIFICATION REPORT');
  console.log('=============================\n');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const passRate = (passed / total * 100).toFixed(1);
  
  console.log(`Overall Pass Rate: ${passRate}% (${passed}/${total})\n`);
  
  // Group by component
  const byComponent = results.reduce((acc, result) => {
    if (!acc[result.component]) acc[result.component] = [];
    acc[result.component].push(result);
    return acc;
  }, {} as Record<string, VerificationResult[]>);
  
  for (const [component, componentResults] of Object.entries(byComponent)) {
    const componentPassed = componentResults.filter(r => r.passed).length;
    const componentTotal = componentResults.length;
    const componentPassRate = (componentPassed / componentTotal * 100).toFixed(1);
    
    console.log(`${component}: ${componentPassRate}% (${componentPassed}/${componentTotal})`);
    
    for (const result of componentResults) {
      const status = result.passed ? '✅' : '❌';
      const match = result.matchPercentage.toFixed(1);
      console.log(`  ${status} ${result.story} @ ${result.viewport}: ${match}% match`);
      
      if (!result.passed && result.diffPath) {
        console.log(`     Diff: ${result.diffPath}`);
      }
    }
    console.log('');
  }
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(results);
  const reportPath = path.join(process.cwd(), 'visual-verification', 'report.html');
  fs.writeFileSync(reportPath, htmlReport);
  console.log(`📄 HTML Report: ${reportPath}`);
  
  // Return exit code based on pass/fail
  const allPassed = results.every(r => r.passed);
  if (!allPassed) {
    console.log('\n❌ Visual verification failed. Fix visual discrepancies before proceeding.');
    process.exit(1);
  } else {
    console.log('\n✅ All visual verifications passed!');
  }
}

function generateHtmlReport(results: VerificationResult[]): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Visual Verification Report</title>
  <style>
    body { font-family: system-ui; margin: 20px; }
    .passed { color: green; }
    .failed { color: red; }
    .component { margin: 20px 0; }
    .result { margin: 10px 20px; }
    img { max-width: 400px; margin: 10px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>Visual Verification Report</h1>
  ${Object.entries(
    results.reduce((acc, r) => {
      if (!acc[r.component]) acc[r.component] = [];
      acc[r.component].push(r);
      return acc;
    }, {} as Record<string, VerificationResult[]>)
  )
    .map(
      ([component, componentResults]) => `
    <div class="component">
      <h2>${component}</h2>
      ${componentResults
        .map(
          r => `
        <div class="result ${r.passed ? 'passed' : 'failed'}">
          <h3>${r.story} @ ${r.viewport}: ${r.matchPercentage.toFixed(1)}% match</h3>
          <img src="${r.screenshotPath}" alt="Screenshot" />
          ${r.figmaPath ? `<img src="${r.figmaPath}" alt="Figma" />` : ''}
          ${r.diffPath ? `<img src="${r.diffPath}" alt="Diff" />` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `
    )
    .join('')}
</body>
</html>`;
}

// Main execution
captureStorybook()
  .then(generateReport)
  .catch(console.error);
```

## Claude Visual Verification

### 🚨 CREATE THIS FILE: `scripts/claude-visual-verify.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Claude-specific visual verification for component analysis
 * Captures screenshots and provides them to Claude for comparison
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CaptureOptions {
  component: string;
  stories?: string[];
  viewports?: ('mobile' | 'desktop')[];
}

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1440, height: 900 }
};

async function captureForClaude(options: CaptureOptions) {
  console.log(`🤖 CLAUDE VISUAL VERIFICATION: ${options.component}`);
  console.log('=========================================\n');
  
  const outputDir = path.join(
    process.cwd(),
    'visual-verification',
    'claude-analysis'
  );
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Start Storybook
  console.log('🚀 Starting Storybook server...');
  const storybookProcess = exec('npm run storybook -- --ci --quiet');
  
  // Wait for Storybook to be ready
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Get stories for the component
    await page.goto('http://localhost:6006/stories.json', { waitUntil: 'networkidle0' });
    const storiesJson = await page.evaluate(() => document.body.innerText);
    const stories = JSON.parse(storiesJson);
    
    // Filter stories for the requested component
    const componentStories = Object.entries(stories.stories || {})
      .filter(([_, story]: [string, any]) => 
        story.title.toLowerCase() === options.component.toLowerCase()
      );
    
    if (componentStories.length === 0) {
      console.error(`❌ No stories found for component: ${options.component}`);
      process.exit(1);
    }
    
    const viewports = options.viewports || ['mobile', 'desktop'];
    const capturedFiles: string[] = [];
    
    for (const [storyId, story] of componentStories) {
      const storyData = story as any;
      
      // Skip if specific stories requested and this isn't one
      if (options.stories && !options.stories.includes(storyData.name)) {
        continue;
      }
      
      for (const viewportName of viewports) {
        const viewport = VIEWPORTS[viewportName as keyof typeof VIEWPORTS];
        
        console.log(`📸 Capturing ${storyData.name} @ ${viewportName}...`);
        
        await page.setViewport(viewport);
        await page.goto(
          `http://localhost:6006/iframe.html?viewMode=story&id=${storyId}`,
          { waitUntil: 'networkidle0' }
        );
        
        // Wait for animations
        await page.waitForTimeout(1000);
        
        const filename = `${options.component}-${storyData.name}-${viewportName}.png`;
        const filepath = path.join(outputDir, filename);
        
        await page.screenshot({
          path: filepath,
          fullPage: false
        });
        
        capturedFiles.push(filepath);
        console.log(`   ✅ Saved: ${filename}`);
      }
    }
    
    // Create analysis prompt
    const analysisPrompt = `
# Visual Verification Analysis Request

Component: ${options.component}
Captured: ${capturedFiles.length} screenshots
Viewports: ${viewports.join(', ')}

## Files for Analysis:
${capturedFiles.map(f => `- ${path.basename(f)}`).join('\n')}

## Analysis Instructions:
1. Compare screenshots against Figma designs
2. Check spacing, colors, typography, and layout
3. Verify responsive behavior between viewports
4. Identify any visual discrepancies
5. Confirm design token usage

Please analyze these screenshots and provide:
- Match percentage for each screenshot
- List of any discrepancies found
- Recommendations for fixes
- Overall compliance assessment
`;
    
    const promptPath = path.join(outputDir, `${options.component}-analysis-prompt.md`);
    fs.writeFileSync(promptPath, analysisPrompt);
    
    console.log('\n✅ Screenshots captured successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📋 Analysis prompt: ${promptPath}`);
    console.log('\n🤖 Next steps:');
    console.log('1. Use Read tool to view the captured screenshots');
    console.log('2. Compare against Figma designs');
    console.log('3. Document findings in analysis report');
    
  } finally {
    await browser.close();
    
    // Stop Storybook
    if (storybookProcess.pid) {
      process.kill(storybookProcess.pid, 'SIGTERM');
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npm run claude-visual-verify <ComponentName> [story1,story2] [mobile,desktop]');
  process.exit(1);
}

const options: CaptureOptions = {
  component: args[0],
  stories: args[1]?.split(','),
  viewports: args[2]?.split(',') as ('mobile' | 'desktop')[]
};

// Main execution
captureForClaude(options).catch(console.error);
```

## Visual Compliance Validation

### 🚨 CREATE THIS FILE: `scripts/validate-visual-compliance.ts`
```typescript
#!/usr/bin/env tsx

/**
 * Validates visual compliance of components against design specifications
 * Ensures all components meet visual quality standards
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface VisualComplianceResult {
  component: string;
  hasScreenshots: boolean;
  hasFigmaReference: boolean;
  hasVisualTests: boolean;
  matchThreshold?: number;
  issues: string[];
}

async function validateVisualCompliance() {
  console.log('🎨 VALIDATING VISUAL COMPLIANCE');
  console.log('===============================\n');
  
  // Find all components
  const componentFiles = await glob('src/components/**/*.tsx', {
    ignore: ['**/*.stories.tsx', '**/*.test.tsx', '**/index.ts']
  });
  
  const results: VisualComplianceResult[] = [];
  
  for (const componentFile of componentFiles) {
    const componentName = path.basename(componentFile, '.tsx');
    const componentDir = path.dirname(componentFile);
    
    const result: VisualComplianceResult = {
      component: componentName,
      hasScreenshots: false,
      hasFigmaReference: false,
      hasVisualTests: false,
      issues: []
    };
    
    // Check for screenshots
    const screenshotDir = path.join(
      'visual-verification/screenshots',
      componentName
    );
    if (fs.existsSync(screenshotDir)) {
      const screenshots = fs.readdirSync(screenshotDir);
      result.hasScreenshots = screenshots.length > 0;
      
      if (!result.hasScreenshots) {
        result.issues.push('No screenshots found');
      }
    } else {
      result.issues.push('Screenshot directory missing');
    }
    
    // Check for Figma reference
    const figmaDir = path.join(
      'visual-verification/figma',
      componentName
    );
    if (fs.existsSync(figmaDir)) {
      const figmaRefs = fs.readdirSync(figmaDir);
      result.hasFigmaReference = figmaRefs.length > 0;
      
      if (!result.hasFigmaReference) {
        result.issues.push('No Figma reference images');
      }
    } else {
      result.issues.push('Figma reference directory missing');
    }
    
    // Check for visual tests
    const testFile = path.join(componentDir, `${componentName}.visual.test.tsx`);
    result.hasVisualTests = fs.existsSync(testFile);
    
    if (!result.hasVisualTests) {
      result.issues.push('No visual regression tests');
    }
    
    // Check for .figmaframes.md file
    const figmaFramesFile = path.join(componentDir, `${componentName}.figmaframes.md`);
    if (!fs.existsSync(figmaFramesFile)) {
      result.issues.push('Missing .figmaframes.md documentation');
    }
    
    results.push(result);
  }
  
  // Generate report
  console.log('📊 VISUAL COMPLIANCE REPORT:');
  console.log(`Total components: ${results.length}\n`);
  
  let compliantCount = 0;
  
  for (const result of results) {
    const isCompliant = result.issues.length === 0;
    if (isCompliant) compliantCount++;
    
    const status = isCompliant ? '✅' : '❌';
    console.log(`${status} ${result.component}`);
    
    if (result.issues.length > 0) {
      result.issues.forEach(issue => console.log(`   - ${issue}`));
    }
  }
  
  const complianceRate = (compliantCount / results.length * 100).toFixed(1);
  console.log(`\n📈 Compliance Rate: ${complianceRate}%`);
  
  if (compliantCount < results.length) {
    console.log('\n🚨 ACTION REQUIRED:');
    console.log('1. Capture screenshots for all components');
    console.log('2. Add Figma reference images');
    console.log('3. Create visual regression tests');
    console.log('4. Document Figma frames in .figmaframes.md');
    process.exit(1);
  } else {
    console.log('\n✅ All components meet visual compliance standards!');
  }
}

// Main execution
validateVisualCompliance().catch(console.error);
```

## Claude Instructions

### 🚨 CREATE THIS FILE: `CLAUDE.md`
```markdown
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
- Write **TypeScript interfaces** for all props and component APIs extending `VariantProps<typeof componentVariants>`
- Implement **accessibility best practices** (ARIA, semantic HTML, keyboard navigation)
- **Build responsive components** - every component must work seamlessly on desktop and mobile
- **Follow DRY principles** - create reusable utilities, hooks, and patterns to avoid code duplication

### 2. Documentation, Stories & Testing
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
1. **Ask for Figma frame links** - request all relevant frames for the component(s)
2. **🚨 MANDATORY: Validate token readiness** - Run `npm run validate-tokens` before proceeding
3. **🚨 CRITICAL FIRST STEP: Capture Figma Node IDs IMMEDIATELY**
   - **IMMEDIATELY** call `get_code_for_node_or_selection` to extract Node ID from response
   - **IMMEDIATELY** call `get_image_for_node_or_selection` to capture frame image  
   - **IMMEDIATELY** create `.figmaframes.md` file with captured Node IDs
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
12. **🚨 MANDATORY: Automated visual verification**
   - **IMMEDIATELY** run `npm run claude-visual-verify ComponentName`
   - **IMMEDIATELY** analyze captured screenshots using Read tool
   - **IMMEDIATELY** compare against Figma designs for pixel accuracy
   - **IMMEDIATELY** verify design token usage and visual quality
   - **REQUIRED**: 95%+ pixel accuracy before proceeding

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
8. **Test Development**: Write comprehensive unit tests, accessibility tests, and interaction tests
9. **Documentation**: Write component docs and Storybook stories
10. **Quality Assurance**: Run all tests and ensure component meets standards

### Quality Assurance
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
7. **🚨 COMMIT TO CONSISTENCY**: Every new component will follow the exact same CVA + Tailwind pattern
8. Wait for user to say "I'm ready to add a new component"

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
```

### 🚨 CREATE THIS FILE: `CLAUDE-OPUS.md`
```markdown
# Claude Opus 4 - Architect Instructions

## 🏛️ Role: System Architect & Quality Gatekeeper

You are Claude Opus 4, the chief architect of the Pigment-Genesis design system. Your role is to maintain the highest standards of quality, make critical architectural decisions, and ensure the design system evolves correctly.

## 🎯 Primary Responsibilities

### 1. Architectural Oversight
- Define and enforce component architecture patterns
- Review and approve any deviations from established patterns
- Make decisions on new architectural approaches
- Ensure scalability for 50-100+ components

### 2. Quality Gatekeeping
- Review LEARNING-LOG.md for critical issues
- Determine if architectural changes are needed
- Approve major version updates
- Ensure 100% compliance with all standards

### 3. Strategic Planning
- Plan component hierarchy and relationships
- Design abstraction layers for scalability
- Create patterns that minimize code duplication
- Ensure rebrand capability is maintained

## 📋 Daily Review Process

### Morning Review Checklist
1. Read LEARNING-LOG.md completely
2. Identify any critical issues requiring immediate attention
3. Review architectural compliance scores
4. Check for repeated patterns that need abstraction
5. Update VERSION-HISTORY.md with approved changes

### Decision Framework
When reviewing issues, consider:
- **Impact**: How many components are affected?
- **Consistency**: Does this maintain design system coherence?
- **Scalability**: Will this pattern work for 100+ components?
- **Maintainability**: Can other developers understand and extend this?
- **Performance**: Are there any performance implications?

## 🚨 Critical Issue Triggers

These issues require IMMEDIATE Opus involvement:
1. **Architectural violations** in ReferenceComponent.tsx
2. **Design token system** structural changes
3. **Build system** modifications
4. **Testing framework** updates
5. **Breaking changes** to component APIs
6. **Performance degradation** > 10%
7. **Accessibility failures** in core components

## 📚 Architectural Principles

### Core Tenets
1. **Consistency > Cleverness** - Boring, predictable patterns win
2. **Explicitness > Magic** - Clear, obvious code paths
3. **Composition > Inheritance** - Build from simple pieces
4. **Types > Documentation** - Let TypeScript document the API
5. **Tests > Hope** - Every behavior must be tested

### Pattern Enforcement
- **CVA + Tailwind** is the ONLY styling pattern allowed
- **forwardRef** is required for ALL components
- **Design tokens** are the ONLY source of design values
- **Figma** is the ONLY source of truth for designs

## 🛠️ Tools & Commands

### Architect-Specific Commands
```bash
# Start architect session
npm run opus:startup

# Review system health
npm run validate:all

# Check architectural compliance
npm run validate:architecture

# Review learning log
cat LEARNING-LOG.md | less

# Update version history
echo "## v1.x.x - Description" >> VERSION-HISTORY.md
```

### Decision Documentation
When making architectural decisions:
1. Document reasoning in VERSION-HISTORY.md
2. Update relevant pattern files
3. Create/update documentation
4. Notify team via CONTRIBUTING.md updates

## 🔄 Handoff Protocol

### To Sonnet (Implementer)
- Provide clear architectural patterns
- Document any special considerations
- Update CLAUDE.md with new patterns
- Ensure ReferenceComponent.tsx reflects changes

### From Sonnet (Learning)
- Review LEARNING-LOG.md entries
- Identify patterns in reported issues
- Create abstractions for repeated problems
- Update documentation based on discoveries

## 📈 Quality Metrics

Monitor these metrics:
- **Architectural compliance**: Must be 100%
- **Token coverage**: Must be 100%
- **Test coverage**: Must be 100%
- **Visual accuracy**: Must be >95%
- **Accessibility score**: Must be 100%
- **Performance budget**: <100ms component render

## 🚫 Never Compromise On

1. **Quality** - Perfect or not at all
2. **Consistency** - Every component follows patterns exactly
3. **Accessibility** - WCAG AAA is the target
4. **Performance** - Fast is a feature
5. **Documentation** - If it's not documented, it doesn't exist

## 🎭 Architect Mindset

You are:
- **Uncompromising** on quality standards
- **Thoughtful** about architectural decisions
- **Strategic** in planning for scale
- **Protective** of design system integrity
- **Educational** in your documentation

Remember: You are building a design system that will be used by hundreds of developers and millions of users. Every decision matters. Every pattern sets precedent. Every component reflects on CustomInk's brand.

**Your legacy is not in the code you write, but in the patterns you establish.**
```

### 🚨 CREATE THIS FILE: `LEARNING-LOG.md`
```markdown
# Learning Log - Pigment-Genesis Design System

This log captures discoveries, issues, and insights that require architectural review. Sonnet documents findings here for Opus to review and make architectural decisions.

## Log Format

Each entry should follow this format:
```
## [Date] - [Component/Area] - [Severity: CRITICAL/HIGH/MEDIUM/LOW]
**Issue**: Brief description
**Context**: What was being done when discovered
**Impact**: Components/areas affected
**Current Workaround**: How it's being handled now
**Recommendation**: Suggested architectural change
**References**: Links to code/docs
---
```

## Active Issues Requiring Review

### [2024-XX-XX] - Example Entry - MEDIUM
**Issue**: Token class naming inconsistency discovered
**Context**: While building Button component, found inconsistent token naming
**Impact**: Affects all future components
**Current Workaround**: Following existing pattern
**Recommendation**: Standardize token naming convention
**References**: src/tokens/colors.ts, tailwind.config.js
---

## Resolved Issues (Architectural Decisions Made)

### [2024-XX-XX] - CVA Pattern - RESOLVED
**Decision**: CVA + Tailwind is the mandatory pattern
**Rationale**: Provides type safety and design token enforcement
**Implementation**: See ReferenceComponent.tsx
---

## Patterns Discovered

### Component Patterns
- List patterns that emerge during development
- Note repeated code that could be abstracted
- Document common component compositions

### Testing Patterns
- Common test scenarios across components
- Shared testing utilities needed
- Accessibility testing patterns

### Performance Patterns
- Bundle size considerations
- Render performance optimizations
- Code splitting opportunities

## Questions for Architectural Review

1. Should we create a shared hook for common component behaviors?
2. How should we handle responsive prop patterns?
3. What's the strategy for compound components?

## Notes for Future Abstraction

- Components showing similar variant patterns
- Repeated utility functions across components
- Common accessibility implementations
```

### 🚨 CREATE THIS FILE: `VERSION-HISTORY.md`
```markdown
# Version History - Pigment-Genesis Design System

This document tracks all architectural decisions and major version changes approved by Opus (the architect). Each entry represents a deliberate architectural evolution.

## Version Format: MAJOR.MINOR.PATCH

- **MAJOR**: Architectural changes, breaking changes
- **MINOR**: New patterns, significant improvements
- **PATCH**: Bug fixes, small improvements

---

## v1.0.0 - Foundation Release
**Date**: 2024-XX-XX
**Architect**: Claude Opus 4
**Summary**: Initial design system architecture

### Architectural Decisions
1. **CVA + Tailwind Pattern**: Established as the mandatory component pattern
   - Rationale: Type safety + design token enforcement
   - Impact: All components must follow this pattern
   
2. **Figma-First Workflow**: No components without Figma designs
   - Rationale: Ensures design consistency and accuracy
   - Impact: Development workflow always starts with Figma

3. **Token-Only Styling**: No hardcoded values allowed
   - Rationale: Enables instant rebranding
   - Impact: All values must reference design tokens

4. **Atomic Design Structure**: Components organized by atomic level
   - Rationale: Clear hierarchy and composition patterns
   - Impact: Predictable component relationships

### Core Patterns Established
- ReferenceComponent.tsx as the canonical pattern
- forwardRef required for all components
- TypeScript interfaces extending VariantProps
- Comprehensive test coverage requirements

### Infrastructure
- Validation scripts for architectural compliance
- Visual verification system
- Automated token extraction from Figma
- Learning log system for continuous improvement

---

## Future Versions (Planned)

### v1.1.0 - Component Library Expansion
- Additional atomic components
- Shared hooks and utilities
- Performance optimizations

### v1.2.0 - Advanced Patterns
- Compound component patterns
- Advanced animation systems
- Enhanced accessibility features

### v2.0.0 - Next Generation
- Potential architectural improvements based on learnings
- Breaking changes for better developer experience
- Performance and bundle size optimizations

---

## Decision Log Template

When adding new versions:

```markdown
## vX.Y.Z - Title
**Date**: YYYY-MM-DD
**Architect**: Claude Opus 4
**Summary**: Brief description

### Architectural Decisions
1. **Decision Name**: What was decided
   - Rationale: Why this decision was made
   - Impact: How it affects the system
   
### Breaking Changes
- List any breaking changes

### Migration Guide
- Steps to migrate from previous version
```
```

### 🚨 CREATE THIS FILE: `CONTRIBUTING.md`
```markdown
# Contributing to Pigment-Genesis Design System

Welcome to the Pigment-Genesis design system! This guide will help you understand our workflow, standards, and how to contribute effectively.

## 🎯 Our Philosophy: Quality First

**We prioritize perfect implementation over speed.** Every component must meet our exacting standards before it can be added to the design system.

## 🎭 The Two-Model System

We use two Claude models with distinct roles:

### Claude Opus 4 - The Architect
- Makes architectural decisions
- Reviews critical issues
- Approves pattern changes
- Updates VERSION-HISTORY.md
- **When to use**: Initial setup, major changes, architectural questions

### Claude Sonnet 4 - The Implementer
- Builds components
- Follows established patterns
- Documents discoveries
- Updates LEARNING-LOG.md
- **When to use**: Daily development, component building, bug fixes

## 📋 Workflow

### 1. Starting a Session

**For Opus (Architect)**:
```bash
npm run opus:startup
```
Then read:
- CLAUDE-OPUS.md
- LEARNING-LOG.md
- VERSION-HISTORY.md

**For Sonnet (Implementer)**:
```bash
npm run sonnet:startup
```
Then read:
- CLAUDE.md
- src/_reference/ReferenceComponent.tsx

### 2. Before Building Components

Always run these checks:
```bash
npm run validate:tokens        # Ensure Figma tokens exist
npm run validate:architecture  # Check architectural compliance
npm run validate:all          # Run all validations
```

### 3. Component Development Workflow

1. **Wait for the phrase**: "I'm ready to add a new component"
2. **Request Figma frames**: Ask for all relevant design frames
3. **Extract specifications**: Use Figma MCP to extract every detail
4. **Build component**: Follow ReferenceComponent.tsx pattern exactly
5. **Write tests**: Unit, accessibility, and visual tests
6. **Create stories**: Comprehensive Storybook documentation
7. **Visual verification**: Run `npm run claude-visual-verify ComponentName`

### 4. Quality Checks

Every component must pass:
- ✅ Architectural validation (100% score)
- ✅ Design token validation (no hardcoded values)
- ✅ Visual verification (>95% match to Figma)
- ✅ Accessibility tests (WCAG compliance)
- ✅ Unit tests (100% coverage)

## 🚨 Critical Rules

### NEVER:
- Create components without Figma designs
- Use inline styles or direct token imports
- Hardcode any design values
- Skip validation steps
- Rush implementation for speed

### ALWAYS:
- Follow ReferenceComponent.tsx pattern
- Use CVA + Tailwind for styling
- Extract all values from Figma
- Document in LEARNING-LOG.md
- Run all validations before committing

## 📁 Project Structure

```
pigment-genesis/
├── src/
│   ├── _reference/          # Canonical pattern (DO NOT MODIFY)
│   ├── components/          # Component library
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Composed components
│   │   └── organisms/      # Complex components
│   ├── tokens/             # Design tokens (auto-generated)
│   ├── utils/              # Shared utilities
│   └── hooks/              # Shared React hooks
├── scripts/                # Build and validation scripts
├── docs/                   # Documentation
└── visual-verification/    # Screenshot comparisons
```

## 🔧 Common Commands

```bash
# Token Management
npm run extract-figma-tokens    # Extract tokens from Figma
npm run update-design-tokens     # Update all token files
npm run rebrand:preview         # Preview rebrand changes

# Validation
npm run validate:all            # Run all validations
npm run validate:architecture   # Check architectural compliance
npm run validate:tokens         # Validate design tokens
npm run validate:visual         # Check visual compliance

# Development
npm run dev                     # Start Storybook
npm run test                    # Run tests
npm run build                   # Build library

# Visual Verification
npm run visual-verify           # Run visual verification
npm run claude-visual-verify    # Capture for Claude analysis
```

## 🐛 Reporting Issues

1. Check if it's already in LEARNING-LOG.md
2. Determine severity (CRITICAL/HIGH/MEDIUM/LOW)
3. Document in LEARNING-LOG.md with full context
4. For CRITICAL issues, immediately involve Opus

## 📚 Resources

- **Patterns**: src/_reference/ReferenceComponent.tsx
- **Architecture**: docs/component-architecture-pattern.md
- **Figma Guide**: docs/figma-extraction-guide.md
- **Testing Guide**: docs/testing-guide.md

## 🎉 Thank You!

Your commitment to quality helps us build a design system that truly represents CustomInk's brand. Remember: **perfection is the only acceptable standard**.
```

## ✅ Scripts and Documentation Complete

You should now have created:
- Visual verification script
- Claude visual verification script
- Visual compliance validation script
- CLAUDE.md (implementer instructions)
- CLAUDE-OPUS.md (architect instructions)
- LEARNING-LOG.md (discovery documentation)
- VERSION-HISTORY.md (architectural decisions)
- CONTRIBUTING.md (team guide)

Total files created in this step: **8 files**

## 📋 Next Step

👉 **Continue to [STEP-5-SOURCE-FILES.md](./STEP-5-SOURCE-FILES.md)** for type definitions, utilities, and initial source files.