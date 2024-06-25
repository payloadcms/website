// project reducer

import type { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'

import type { Plan } from '@root/payload-cloud-types.js'

interface SET_PLAN {
  type: 'SET_PLAN'
  payload: Plan
}

interface SET_TEAM {
  type: 'SET_TEAM'
  payload: TeamWithCustomer
}

interface UPDATE_STATE {
  type: 'UPDATE_STATE'
  payload: Partial<CheckoutState>
}

interface SET_PAYMENT_METHOD {
  type: 'SET_PAYMENT_METHOD'
  payload: string
}

interface SET_FREE_TRIAL {
  type: 'SET_FREE_TRIAL'
  payload: boolean
}

type Action = UPDATE_STATE | SET_PLAN | SET_TEAM | SET_PAYMENT_METHOD | SET_FREE_TRIAL

export interface CheckoutState {
  team: TeamWithCustomer
  plan: Plan
  paymentMethod: string
  freeTrial: boolean
}

export const checkoutReducer = (state: CheckoutState, action: Action): CheckoutState => {
  switch (action.type) {
    case 'UPDATE_STATE':
      return { ...state, ...action.payload }
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
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'SET_FREE_TRIAL':
      return { ...state, freeTrial: action.payload }
    default:
      return state
  }
}
