// project reducer

import type { Plan, Project, Team } from '@root/payload-cloud-types'

interface SET_PLAN {
  type: 'SET_PLAN'
  payload: Plan
}

interface SET_PROJECT {
  type: 'SET'
  payload: Project
}

interface UPDATE_PROJECT {
  type: 'UPDATE'
  payload: Project
}

interface SET_TEAM {
  type: 'SET_TEAM'
  payload: Team
}

type Action = SET_PROJECT | UPDATE_PROJECT | SET_PLAN | SET_TEAM

export const projectReducer = (state: Project, action: Action): Project => {
  switch (action.type) {
    case 'SET':
      return { ...action.payload }
    case 'UPDATE':
      return { ...state, ...action.payload }
    case 'SET_PLAN':
      return { ...state, plan: action.payload }
    case 'SET_TEAM':
      return { ...state, team: action.payload }
    default:
      return state
  }
}
