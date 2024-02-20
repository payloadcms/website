import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

// display an error to the user if the team has no default payment method
// might also want to only do this if the team has published projects, new accounts should see no errors
// i.e. team?.hasPublishedProjects && !team?.hasDefaultPaymentMethod
export const teamHasDefaultPaymentMethod = (team: TeamWithCustomer): boolean => {
  const defaultPaymentMethod = team?.stripeCustomer?.invoice_settings?.default_payment_method
  return Boolean(defaultPaymentMethod)
}
