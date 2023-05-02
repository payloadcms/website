export interface ValidatedDomainResult {
  isUnique?: boolean
  domain: string
}

type ValidatedDomainAction =
  | {
      type: 'SET_UNIQUE'
      payload: boolean
    }
  | {
      type: 'RESET'
      payload: ValidatedDomainResult
    }

export const validatedDomainReducer = (
  state: ValidatedDomainResult,
  action: ValidatedDomainAction,
): ValidatedDomainResult => {
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
