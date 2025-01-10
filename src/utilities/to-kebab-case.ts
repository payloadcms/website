export const toKebabCase = (string?: null | string): string =>
  (string || '')
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
