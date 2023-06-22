export interface SlugValidationResult {
  isUnique?: boolean
  slug: string
  fetched?: boolean
}

type SlugValidationAction =
  | {
      type: 'SET_UNIQUE'
      payload: boolean
    }
  | {
      type: 'SET_SLUG'
      payload: string
    }
  | {
      type: 'RESET'
      payload: SlugValidationResult
    }

export const slugValidationReducer = (
  state: SlugValidationResult,
  action: SlugValidationAction,
): SlugValidationResult => {
  switch (action.type) {
    case 'SET_UNIQUE':
      return {
        ...state,
        isUnique: action.payload,
        fetched: true,
      }
    case 'SET_SLUG':
      return {
        ...state,
        slug: action.payload,
      }
    case 'RESET':
      return {
        ...state,
        ...action.payload,
        fetched: true,
      }
    default:
      return state
  }
}
