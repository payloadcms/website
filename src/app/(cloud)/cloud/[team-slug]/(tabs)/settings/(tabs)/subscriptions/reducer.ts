import type { SubscriptionsResult } from '@cloud/_api/fetchSubscriptions.js'

export const subscriptionsReducer = (
  state: SubscriptionsResult | null,
  action: {
    type: 'reset' | 'add'
    payload: SubscriptionsResult
  },
): SubscriptionsResult | null => {
  switch (action.type) {
    case 'reset':
      return action.payload
    case 'add':
      return {
        ...(state || {}),
        data: [...(state?.data || []), ...(action?.payload?.data || [])],
        has_more: action?.payload?.has_more || false,
      }
    default:
      return state
  }
}
