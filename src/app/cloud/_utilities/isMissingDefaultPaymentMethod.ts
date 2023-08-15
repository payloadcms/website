import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

// display an error to the user if the team has no default payment method
// only do this if the team has published projects, new accounts should see no errors
export const isMissingDefaultPaymentMethod = (team: TeamWithCustomer): boolean => {
  const defaultPaymentMethod = team?.stripeCustomer?.invoice_settings?.default_payment_method
  const showMessage = team?.hasPublishedProjects && !defaultPaymentMethod
  return showMessage
}
