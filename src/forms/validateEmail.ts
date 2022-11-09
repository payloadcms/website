import type { Validate } from './types'

const validateEmail: Validate = value => {
  const stringValue = value as string

  if (!/\S+@\S+\.\S+/.test(stringValue)) {
    return 'Please enter a valid email address.'
  }

  return true
}

export default validateEmail
