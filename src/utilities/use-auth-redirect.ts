import { redirect, useRouter } from 'next/navigation'

import { useAuth } from '@root/providers/Auth'

// call this component _after_ all of your own hooks, before your return statement
export const useAuthRedirect = (): string | null => {
  const { user } = useAuth()
  const pathname = useRouter()

  if (user === null) {
    redirect(`/login?redirect=${pathname}`)
  }

  if (!user) {
    return 'Loading...'
  }

  return null
}
