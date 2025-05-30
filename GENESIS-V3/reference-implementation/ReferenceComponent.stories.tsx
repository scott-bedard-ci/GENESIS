import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ReferenceComponent } from './ReferenceComponent';

/**
 * 🔑 REFERENCE COMPONENT STORIES - THE CANONICAL PATTERN
 * 
 * This file demonstrates the EXACT structure all component stories must follow.
 * Every story file in the design system should match this format precisely.
 * 
 * Key Requirements:
 * 1. Complete Meta configuration with all parameters
 * 2. Comprehensive documentation in the meta
 * 3. Individual stories for each variant/state
 * 4. Render functions for complex examples
 * 5. Proper story naming and organization
 */

const meta: Meta<typeof ReferenceComponent> = {
  title: 'Reference/ReferenceComponent',
  component: ReferenceComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Reference Component

This is the canonical reference implementation for all components in the Pigment-Genesis design system.
**This component should NEVER be used in production** - it exists solely as a template.

## Design Specifications

Built with 100% Figma fidelity from:
- Frame 1: [Node ID] - Component Specifications
- Frame 2: [Node ID] - Component States  
- Frame 3: [Node ID] - Component Variants
- Frame 4: [Node ID] - Usage Guidelines
- Frame 5: [Node ID] - Examples & Patterns

## Key Features

- **CVA Architecture**: Class Variance Authority for variant management
- **Design Tokens**: 100% token usage, no hardcoded values
- **Accessibility**: Full ARIA support and keyboard navigation
- **Responsive**: Mobile-first with desktop enhancements
- **TypeScript**: Fully typed with proper interfaces

## Usage Guidelines

### ✅ Do's
- Use this as a template for new components
- Follow the exact same file structure
- Maintain consistent documentation format
- Include all necessary stories

### ❌ Don'ts  
- Don't use this component in production
- Don't deviate from the established patterns
- Don't skip documentation sections
- Don't hardcode any values
`,
      },
    },
    design: {
      type: 'figma',
      url: '[Figma URL]',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
      description: 'The visual style variant of the component',
      table: {
        type: { summary: 'primary | secondary | destructive' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the component',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the component should take full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'The content to display inside the component',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
      table: {
        type: { summary: '(event: React.MouseEvent) => void' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// INDIVIDUAL VARIANT STORIES
// Each variant should have its own story for easy testing and documentation

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Component',
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary variant used for main call-to-action elements.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Component',
  },
  parameters: {
    docs: {
      description: {
        story: 'The secondary variant used for alternative actions.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'medium',
    children: 'Destructive Component',
  },
  parameters: {
    docs: {
      description: {
        story: 'The destructive variant used for dangerous actions like delete.',
      },
    },
  },
};

// SIZE VARIATIONS
// Demonstrate all size options

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ReferenceComponent size="small">Small</ReferenceComponent>
      <ReferenceComponent size="medium">Medium</ReferenceComponent>
      <ReferenceComponent size="large">Large</ReferenceComponent>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available size options shown side by side.',
      },
    },
  },
};

// STATE DEMONSTRATIONS
// Show all interactive states

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {/* Row 1: Primary States */}
      <ReferenceComponent variant="primary">Default</ReferenceComponent>
      <ReferenceComponent variant="primary" className="hover">Hover</ReferenceComponent>
      <ReferenceComponent variant="primary" className="active">Active</ReferenceComponent>
      
      {/* Row 2: Secondary States */}
      <ReferenceComponent variant="secondary">Default</ReferenceComponent>
      <ReferenceComponent variant="secondary" className="hover">Hover</ReferenceComponent>
      <ReferenceComponent variant="secondary" className="active">Active</ReferenceComponent>
      
      {/* Row 3: Destructive States */}
      <ReferenceComponent variant="destructive">Default</ReferenceComponent>
      <ReferenceComponent variant="destructive" className="hover">Hover</ReferenceComponent>
      <ReferenceComponent variant="destructive" className="active">Active</ReferenceComponent>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive states for all variants. Note: Hover and active states are simulated.',
      },
    },
  },
};

// RESPONSIVE BEHAVIOR
// Demonstrate responsive width handling

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    fullWidth: true,
    children: 'Full Width Component',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Component stretching to full width of its container (shown in 384px container).',
      },
    },
  },
};

// FIGMA EXAMPLE REPLICATION
// Exact replication of Figma examples

export const FigmaExamples: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Example 1: Form Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Form Actions</h3>
        <div className="flex gap-3">
          <ReferenceComponent variant="primary">Submit</ReferenceComponent>
          <ReferenceComponent variant="secondary">Cancel</ReferenceComponent>
        </div>
      </div>
      
      {/* Example 2: Modal Footer */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Modal Footer</h3>
        <div className="flex gap-3 justify-end p-4 bg-gray-50 rounded">
          <ReferenceComponent variant="secondary">Cancel</ReferenceComponent>
          <ReferenceComponent variant="primary">Save Changes</ReferenceComponent>
        </div>
      </div>
      
      {/* Example 3: Destructive Action */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Destructive Action</h3>
        <ReferenceComponent variant="destructive">Delete Account</ReferenceComponent>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage patterns as shown in Figma Frame 5.',
      },
    },
  },
};

// ACCESSIBILITY DEMONSTRATION
// Show keyboard navigation and screen reader support

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Tab through components to see focus states:</p>
      <div className="flex gap-3">
        <ReferenceComponent variant="primary">First</ReferenceComponent>
        <ReferenceComponent variant="secondary">Second</ReferenceComponent>
        <ReferenceComponent variant="secondary">Third</ReferenceComponent>
      </div>
      <p className="text-sm text-gray-600">
        All components include proper ARIA labels and keyboard support.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation and accessibility features.',
      },
    },
  },
};

// PLAYGROUND
// Interactive story with all controls

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    fullWidth: false,
    children: 'Playground Component',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls to experiment with different prop combinations.',
      },
    },
  },
};