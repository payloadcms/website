// project reducer

import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { Plan } from '@root/payload-cloud-types'

interface SET_PLAN {
  payload: Plan
  type: 'SET_PLAN'
}

interface SET_TEAM {
  payload: TeamWithCustomer
  type: 'SET_TEAM'
}

interface UPDATE_STATE {
  payload: Partial<CheckoutState>
  type: 'UPDATE_STATE'
}

interface SET_PAYMENT_METHOD {
  payload: string
  type: 'SET_PAYMENT_METHOD'
}

interface SET_FREE_TRIAL {
  payload: boolean
  type: 'SET_FREE_TRIAL'
}

type Action = SET_FREE_TRIAL | SET_PAYMENT_METHOD | SET_PLAN | SET_TEAM | UPDATE_STATE

export interface CheckoutState {
  freeTrial: boolean
  paymentMethod: string
  plan: Plan
  team: TeamWithCustomer
}

export const checkoutReducer = (state: CheckoutState, action: Action): CheckoutState => {
  switch (action.type) {
    case 'SET_FREE_TRIAL':
      return { ...state, freeTrial: action.payload }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'SET_PLAN':
      return {
        ...state,
        plan: action.payload,
      }
    case 'SET_TEAM':
      return {
        ...state,
        team: action.payload,
      }
    case 'UPDATE_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}
