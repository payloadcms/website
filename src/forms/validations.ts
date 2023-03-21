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

export const validateDomain: Validate = (domainValue: string) => {
  if (!domainValue) {
    return 'Please enter a domain'
  }

  const validDomainRegex = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/ // source: https://www.regextester.com/103452
  if (!domainValue.match(validDomainRegex)) {
    return `"${domainValue}" is not a fully qualified domain name.`
  }

  return true
}
