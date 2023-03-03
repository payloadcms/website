import canUseDOM from '@root/utilities/can-use-dom'
import type { IndexUiState } from 'instantsearch.js'
import qs from 'qs'

// the 'qs' module parses URL arrays with single items as strings
// so we have to recursively convert them to arrays, see https://github.com/ljharb/qs/issues/305 or https://github.com/ljharb/qs/issues/315
// for example, this is how the qs library handles these two similar search queries:
// qs.parse(?hierarchicalMenu[resourceType.lvl0]=Articles)
// output:
// {
//    hierarchicalMenu: {
//      resourceType.lvl0: 'Articles'
//    }
// }
// qs.parse(?hierarchicalMenu[resourceType.lvl0]=Articles&hierarchicalMenu[resourceType.lvl0]=Podcast%20Episodes)
// output:
// {
//    hierarchicalMenu: {
//      resourceType.lvl0: ['Articles', 'Podcast Episodes]
//    }
// }
// This is really only an issue because the existing links are structured this way, and we aren't able to setup redirects to handle every single case
// Algolia components _want_ to set values as arrays, but we are overriding this with "{ arrayFormat: 'repeat' }" when we stringify the url
// TL:DR; we need to be backwards compatible. This only runs on mount anyway.

export const convertObjectStringsToArrays = (
  object: Record<string, any>,
  isNested?: boolean,
): Record<string, any> => {
  if (object !== null) {
    let copy = JSON.parse(JSON.stringify(object))

    switch (typeof object) {
      case 'string':
        copy = object
        break
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
      default:
        copy = object
        break
    }

    return copy
  }

  return object
}

export const getInitialState = (): IndexUiState => {
  const search = canUseDOM ? window.location.search : ''
  const searchState = qs.parse(search, { ignoreQueryPrefix: true })
  const initialState = convertObjectStringsToArrays(searchState)
  return initialState
}
