import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReferenceComponent } from './ReferenceComponent';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

/**
 * 🔑 REFERENCE COMPONENT TESTS - THE CANONICAL PATTERN
 * 
 * This file demonstrates the EXACT testing structure all components must follow.
 * Every test file should match this organization and coverage.
 * 
 * Test Categories:
 * 1. Rendering & Basic Props
 * 2. Variant Behavior
 * 3. Interactive States
 * 4. Accessibility
 * 5. Edge Cases
 * 6. Design System Compliance
 */

describe('ReferenceComponent', () => {
  // RENDERING & BASIC PROPS
  describe('Rendering & Basic Props', () => {
    it('renders with children', () => {
      render(<ReferenceComponent>Test Content</ReferenceComponent>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ReferenceComponent ref={ref}>Content</ReferenceComponent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies custom className', () => {
      render(
        <ReferenceComponent className="custom-class">
          Content
        </ReferenceComponent>
      );
      const element = screen.getByText('Content');
      expect(element).toHaveClass('custom-class');
    });

    it('spreads additional props', () => {
      render(
        <ReferenceComponent data-testid="test-component" aria-label="Test">
          Content
        </ReferenceComponent>
      );
      const element = screen.getByTestId('test-component');
      expect(element).toHaveAttribute('aria-label', 'Test');
    });
  });

  // VARIANT BEHAVIOR
  describe('Variant Behavior', () => {
    describe('variant prop', () => {
      it('applies primary variant classes by default', () => {
        render(<ReferenceComponent>Primary</ReferenceComponent>);
        const element = screen.getByText('Primary');
        expect(element).toHaveClass('bg-interactive-bg-bold');
        expect(element).toHaveClass('text-interactive-text-on-fill');
      });

      it('applies secondary variant classes', () => {
        render(<ReferenceComponent variant="secondary">Secondary</ReferenceComponent>);
        const element = screen.getByText('Secondary');
        expect(element).toHaveClass('bg-neutral-bg-primary');
        expect(element).toHaveClass('text-interactive-text-default');
        expect(element).toHaveClass('border-interactive-border-bold');
      });

      it('applies destructive variant classes', () => {
        render(<ReferenceComponent variant="destructive">Destructive</ReferenceComponent>);
        const element = screen.getByText('Destructive');
        expect(element).toHaveClass('bg-error-500');
        expect(element).toHaveClass('text-interactive-text-on-fill');
      });
    });

    describe('size prop', () => {
      it('applies medium size classes by default', () => {
        render(<ReferenceComponent>Medium</ReferenceComponent>);
        const element = screen.getByText('Medium');
        expect(element).toHaveClass('h-10');
        expect(element).toHaveClass('px-4');
        expect(element).toHaveClass('py-2');
      });

      it('applies small size classes', () => {
        render(<ReferenceComponent size="small">Small</ReferenceComponent>);
        const element = screen.getByText('Small');
        expect(element).toHaveClass('h-8');
        expect(element).toHaveClass('px-3');
        expect(element).toHaveClass('py-1.5');
      });

      it('applies large size classes', () => {
        render(<ReferenceComponent size="large">Large</ReferenceComponent>);
        const element = screen.getByText('Large');
        expect(element).toHaveClass('h-12');
        expect(element).toHaveClass('px-6');
        expect(element).toHaveClass('py-3');
      });
    });

    describe('fullWidth prop', () => {
      it('does not apply full width by default', () => {
        render(<ReferenceComponent>Default</ReferenceComponent>);
        const element = screen.getByText('Default');
        expect(element).not.toHaveClass('w-full');
      });

      it('applies full width when true', () => {
        render(<ReferenceComponent fullWidth>Full Width</ReferenceComponent>);
        const element = screen.getByText('Full Width');
        expect(element).toHaveClass('w-full');
      });
    });
  });

  // INTERACTIVE STATES
  describe('Interactive States', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(
        <ReferenceComponent onClick={handleClick}>
          Clickable
        </ReferenceComponent>
      );
      
      fireEvent.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events', () => {
      const handleKeyDown = jest.fn();
      render(
        <ReferenceComponent onKeyDown={handleKeyDown}>
          Keyboard
        </ReferenceComponent>
      );
      
      fireEvent.keyDown(screen.getByText('Keyboard'), { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('maintains focus state', () => {
      render(<ReferenceComponent>Focusable</ReferenceComponent>);
      const element = screen.getByText('Focusable');
      
      expect(element).toHaveClass('focus-visible:outline-none');
      expect(element).toHaveClass('focus-visible:ring-2');
    });

    it('handles disabled state styling', () => {
      render(<ReferenceComponent>Disabled</ReferenceComponent>);
      const element = screen.getByText('Disabled');
      
      expect(element).toHaveClass('disabled:pointer-events-none');
      expect(element).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  // ACCESSIBILITY
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ReferenceComponent>Accessible</ReferenceComponent>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(
        <ReferenceComponent aria-label="Custom Label">
          Content
        </ReferenceComponent>
      );
      const element = screen.getByText('Content');
      expect(element).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <ReferenceComponent aria-describedby="description">
            Content
          </ReferenceComponent>
          <span id="description">Description text</span>
        </>
      );
      const element = screen.getByText('Content');
      expect(element).toHaveAttribute('aria-describedby', 'description');
    });

    it('maintains semantic HTML structure', () => {
      const { container } = render(
        <ReferenceComponent>Semantic</ReferenceComponent>
      );
      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  // EDGE CASES
  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      const { container } = render(<ReferenceComponent>{''}</ReferenceComponent>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with null children', () => {
      const { container } = render(<ReferenceComponent>{null}</ReferenceComponent>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with complex children', () => {
      render(
        <ReferenceComponent>
          <span>Complex</span>
          <strong>Children</strong>
        </ReferenceComponent>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Children')).toBeInTheDocument();
    });

    it('handles very long text content', () => {
      const longText = 'A'.repeat(100);
      render(<ReferenceComponent>{longText}</ReferenceComponent>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  // DESIGN SYSTEM COMPLIANCE
  describe('Design System Compliance', () => {
    it('uses only design token classes', () => {
      const { container } = render(
        <ReferenceComponent variant="primary">Token Test</ReferenceComponent>
      );
      const element = container.firstChild as HTMLElement;
      const classes = element.className.split(' ');
      
      // Check that no hardcoded color values are present
      classes.forEach(className => {
        expect(className).not.toMatch(/^bg-\[#/);
        expect(className).not.toMatch(/^text-\[#/);
        expect(className).not.toMatch(/^border-\[#/);
      });
    });

    it('follows component display name convention', () => {
      expect(ReferenceComponent.displayName).toBe('ReferenceComponent');
    });

    it('exports component as default and named export', () => {
      // This is tested implicitly by the imports working
      expect(ReferenceComponent).toBeDefined();
    });

    it('maintains consistent class order with CVA', () => {
      render(<ReferenceComponent>CVA Test</ReferenceComponent>);
      const element = screen.getByText('CVA Test');
      
      // Base classes should come before variant classes
      const className = element.className;
      expect(className).toMatch(/^inline-flex/);
    });
  });

  // SNAPSHOT TESTS
  describe('Snapshots', () => {
    it('matches snapshot for primary variant', () => {
      const { container } = render(
        <ReferenceComponent variant="primary" size="medium">
          Snapshot Test
        </ReferenceComponent>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for all variants', () => {
      const { container } = render(
        <div>
          <ReferenceComponent variant="primary">Primary</ReferenceComponent>
          <ReferenceComponent variant="secondary">Secondary</ReferenceComponent>
          <ReferenceComponent variant="destructive">Destructive</ReferenceComponent>
        </div>
      );
      expect(container).toMatchSnapshot();
    });
  });
});