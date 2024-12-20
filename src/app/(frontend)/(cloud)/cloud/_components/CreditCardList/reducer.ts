import type { PaymentMethod } from '@stripe/stripe-js'

interface ADD_CARD {
  payload: PaymentMethod
  type: 'ADD_CARD'
}

interface DELETE_CARD {
  payload: string
  type: 'DELETE_CARD'
}

interface RESET_CARDS {
  payload: PaymentMethod[]
  type: 'RESET_CARDS'
}

type Action = ADD_CARD | DELETE_CARD | RESET_CARDS

export const cardReducer = (state: PaymentMethod[], action: Action): PaymentMethod[] => {
  switch (action.type) {
    case 'ADD_CARD':
      return [action.payload, ...(state || [])]
    case 'DELETE_CARD':
      return state.filter((card) => card.id !== action.payload)
    case 'RESET_CARDS':
      return action.payload
    default:
      return state
  }
}
