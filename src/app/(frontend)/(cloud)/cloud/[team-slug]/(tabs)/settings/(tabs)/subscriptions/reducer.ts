import type { SubscriptionsResult } from '@cloud/_api/fetchSubscriptions'

export const subscriptionsReducer = (
  state: null | SubscriptionsResult,
  action: {
    payload: SubscriptionsResult
    type: 'add' | 'reset'
  },
): null | SubscriptionsResult => {
  switch (action.type) {
    case 'add':
      return {
        ...(state || {}),
        data: [...(state?.data || []), ...(action?.payload?.data || [])],
        has_more: action?.payload?.has_more || false,
      }
    case 'reset':
      return action.payload
    default:
      return state
  }
}
