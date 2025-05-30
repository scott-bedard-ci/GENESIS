import React, { forwardRef } from 'react';
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

export default ReferenceComponent;