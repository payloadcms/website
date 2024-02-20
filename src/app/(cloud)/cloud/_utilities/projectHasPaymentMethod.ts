import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'

// display an error to the user if the project has payment method
// might also want to only do this if the team has no default payment method
export const projectHasPaymentMethod = (project: ProjectWithSubscription): boolean => {
  const paymentMethod = project?.stripeSubscription?.default_payment_method
  return Boolean(paymentMethod)
}
