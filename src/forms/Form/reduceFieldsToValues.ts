// no declaration file for flatley, and no @types either, so require instead of import
// import flatley from 'flatley';
import flatley from 'flatley'

import type { Fields, Property } from '../types'

const reduceFieldsToValues = (fields: Fields, unflatten: boolean): Property => {
  const data: Property = {}

  Object.keys(fields).forEach(key => {
    if (fields[key].value !== undefined) {
      data[key] = fields[key].value
    }
  })

  if (unflatten) {
    return flatley.unflatten(data, { safe: true })
  }

  return data
}

export default reduceFieldsToValues
