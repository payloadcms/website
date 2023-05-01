export interface SlugValidationResult {
  isUnique?: boolean
  slug: string
}

type SlugValidationAction =
  | {
      type: 'SET_UNIQUE'
      payload: boolean
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
      }
    case 'RESET':
      return action.payload
    default:
      return state
  }
}
