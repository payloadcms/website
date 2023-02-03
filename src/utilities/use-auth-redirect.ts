import { redirect } from 'next/navigation'

import { useAuth } from '@root/providers/Auth'

// call this component _after_ all of your own hooks, before your return statement

export const useAuthRedirect = (): string | null => {
  const { user } = useAuth()

  if (user === null) {
    redirect('/login')
  }

  if (!user) {
    return 'Loading...'
  }

  return null
}
