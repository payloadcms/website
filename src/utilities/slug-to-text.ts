export const slugToText = (slug?: string): string =>
  (slug || '')
    .split('-')
    .map((word, index) =>
      /* eslint-disable */
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase())
    .join(' ')
