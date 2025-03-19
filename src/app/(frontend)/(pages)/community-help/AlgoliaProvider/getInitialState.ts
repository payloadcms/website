import canUseDOM from '@root/utilities/can-use-dom'
import * as qs from 'qs-esm'

export const convertObjectStringsToArrays = (
  object: Record<string, any>,
  isNested?: boolean,
): Record<string, any> => {
  if (object !== null) {
    let copy = JSON.parse(JSON.stringify(object))

    switch (typeof object) {
      case 'object':
        if (object instanceof Array) {
          const length = object.length
          for (let i = 0; i < length; i += 1) {
            copy[i] = convertObjectStringsToArrays(copy[i], true)
          }
        } else {
          for (const i in object) {
            if (i === 'hierarchicalMenu' || isNested) {
              if (typeof copy[i] === 'string') {
                copy[i] = [copy[i]] // when the object property has a value that is a string, convert it to an array before continuing
              }
              copy[i] = convertObjectStringsToArrays(copy[i], true)
            }
          }
        }
        break
      case 'string':
        copy = object
        break
      default:
        copy = object
        break
    }

    return copy
  }

  return object
}

export const getInitialState = () => {
  const search = canUseDOM ? window.location.search : ''
  const searchState = qs.parse(search, { ignoreQueryPrefix: true })
  const initialState = convertObjectStringsToArrays(searchState)
  return initialState
}
