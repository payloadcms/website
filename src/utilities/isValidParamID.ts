/**
 * Check if the input is a valid ID for a URL parameter.
 */
export function isValidParamID(id: null | string): boolean {
  return Boolean(id && /^[a-z\d]+$/.test(id))
}
