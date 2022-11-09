import type { Validate } from './types'

const isValidEmail = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
)

export const validateEmail: Validate = value => {
  const stringValue = value as string

  if (!isValidEmail.test(stringValue)) {
    return 'Please enter a valid email address.'
  }

  return true
}
