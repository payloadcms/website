export interface SlugValidationResult {
  isUnique?: boolean
  slug: string
  fetched?: boolean
  userInteracted?: boolean
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
  | {
      type: 'SET_USER_INTERACTED'
    }

export const stateReducer = (
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
    case 'SET_USER_INTERACTED':
      return {
        ...state,
        userInteracted: true,
      }
    default:
      return state
  }
}
