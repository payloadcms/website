export function isExpandedDoc<T>(doc: T | string): doc is T {
  if (typeof doc === 'object' && doc !== null) return true
  return false
}
