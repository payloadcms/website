// project reducer

import type { Plan, Project, Team } from '@root/payload-cloud-types'

type ProjectWithTeam = Omit<Project, 'team'> & {
  team: Team
}

interface SET_PLAN {
  type: 'SET_PLAN'
  payload: Plan
}

interface SET_PROJECT {
  type: 'SET_PROJECT'
  payload: ProjectWithTeam
}

interface UPDATE_PROJECT {
  type: 'UPDATE_PROJECT'
  payload: ProjectWithTeam
}

interface SET_TEAM {
  type: 'SET_TEAM'
  payload: Team
}

interface SET_PAYMENT_METHOD {
  type: 'SET_PAYMENT_METHOD'
  payload: string
}

interface SET_FREE_TRIAL {
  type: 'SET_FREE_TRIAL'
  payload: boolean
}

type Action =
  | SET_PROJECT
  | UPDATE_PROJECT
  | SET_PLAN
  | SET_TEAM
  | SET_PAYMENT_METHOD
  | SET_FREE_TRIAL

export interface CheckoutState {
  project: ProjectWithTeam
  paymentMethod: string
  freeTrial: boolean
}

export const checkoutReducer = (state: CheckoutState, action: Action): CheckoutState => {
  switch (action.type) {
    case 'SET_PROJECT':
      return { ...state, project: action.payload }
    case 'UPDATE_PROJECT':
      return { ...state, ...action.payload }
    case 'SET_PLAN':
      return {
        ...state,
        project: {
          ...state.project,
          plan: action.payload,
        },
        freeTrial: action.payload?.slug !== 'standard' ? false : state?.freeTrial,
      }
    case 'SET_TEAM':
      return {
        ...state,
        project: {
          ...state.project,
          team: action.payload,
        },
      }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'SET_FREE_TRIAL':
      return { ...state, freeTrial: action.payload }
    default:
      return state
  }
}
