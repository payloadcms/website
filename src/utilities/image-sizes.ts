/* eslint-disable */
/* perfectionist/sort-objects complaining about order of breakpoints */

/**
 * Formats object literals into strings that conform
 * to Next.js's `sizes` prop for the Image component.
 * 
 * The utility function `stringifyBreakpoints({size: number})` 
 * can be imported to create custom breakpoints for specific
 * `Image` components if needed.
 * 
 */

type Breakpoint = {
  [size: string]: number
}

export const stringifyBreakpoints = <B extends Breakpoint>(
  breakpoints: B
): string => {
  return Object.entries(breakpoints)
    .map(([, width]) => `(max-width: ${width}px) ${width}px`)
    .join(', ')
}

export const standardSizes = stringifyBreakpoints({s: 768, m: 1024, l: 1440})