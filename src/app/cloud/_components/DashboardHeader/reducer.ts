import type { Routes } from '.'

interface Action {
  type: 'SET'
  payload: Routes
}

export const reducer = (state: Routes, action: Action): Routes => {
  if (action.type === 'SET') {
    return action.payload
  }

  return state
}
