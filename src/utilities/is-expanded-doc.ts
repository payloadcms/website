export function isExpandedDoc<T>(doc: string | T): doc is T {
  if (typeof doc === 'object' && doc !== null) {
    return true
  }
  return false
}
