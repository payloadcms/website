export const validateKey = (key: string, existingKeys: string[]): string | true => {
  if (!key) {
    return 'Key is required'
  }

  if (!/^\w+$/.test(key)) {
    return 'Only alphanumeric characters and underscores are allowed'
  }

  if (existingKeys?.includes(key)) {
    return 'This key is already in use'
  }

  return true
}

export const validateValue = (value: string): string | true => {
  if (!value) {
    return 'Value is required'
  }

  return true
}
