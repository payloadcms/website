export interface SlugValidationResult {
  fetched?: boolean
  isUnique?: boolean
  slug: string
  userInteracted?: boolean
}

type SlugValidationAction =
  | {
      payload: boolean
      type: 'SET_UNIQUE'
    }
  | {
      payload: SlugValidationResult
      type: 'RESET'
    }
  | {
      payload: string
      type: 'SET_SLUG'
    }
  | {
      type: 'SET_USER_INTERACTED'
    }

export const stateReducer = (
  state: SlugValidationResult,
  action: SlugValidationAction,
): SlugValidationResult => {
  switch (action.type) {
    case 'RESET':
      return {
        ...state,
        ...action.payload,
        fetched: true,
      }
    case 'SET_SLUG':
      return {
        ...state,
        slug: action.payload,
      }
    case 'SET_UNIQUE':
      return {
        ...state,
        fetched: true,
        isUnique: action.payload,
      }
    case 'SET_USER_INTERACTED':
      return {
        ...state,
        userInteracted: true,
      }
    default:
      return state
  }
}
