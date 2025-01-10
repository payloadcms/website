export interface ValidatedDomainResult {
  domain: string
  isUnique?: boolean
}

type ValidatedDomainAction =
  | {
      payload: boolean
      type: 'SET_UNIQUE'
    }
  | {
      payload: ValidatedDomainResult
      type: 'RESET'
    }

export const validatedDomainReducer = (
  state: ValidatedDomainResult,
  action: ValidatedDomainAction,
): ValidatedDomainResult => {
  switch (action.type) {
    case 'RESET':
      return action.payload
    case 'SET_UNIQUE':
      return {
        ...state,
        isUnique: action.payload,
      }
    default:
      return state
  }
}
