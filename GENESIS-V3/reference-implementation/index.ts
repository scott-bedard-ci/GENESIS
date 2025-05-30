/**
 * 🔑 REFERENCE COMPONENT EXPORTS - THE CANONICAL PATTERN
 * 
 * This file demonstrates the EXACT export structure all components must follow.
 * Every component should have an index.ts that matches this pattern.
 * 
 * Export Rules:
 * 1. Named export of the component
 * 2. Default export of the component
 * 3. Type exports for component props
 * 4. Any additional utility exports
 */

// Component exports
export { ReferenceComponent } from './ReferenceComponent';
export { default } from './ReferenceComponent';

// Type exports
export type { ReferenceComponentProps } from './ReferenceComponent';

// Note: If this component had sub-components or utilities, they would be exported here
// Example:
// export { ReferenceComponentGroup } from './ReferenceComponentGroup';
// export { useReferenceComponent } from './useReferenceComponent';
// export type { ReferenceComponentGroupProps } from './ReferenceComponentGroup';