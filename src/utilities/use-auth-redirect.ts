import { redirect, usePathname, useSearchParams } from 'next/navigation'

import { useAuth } from '@root/providers/Auth'

// call this component _after_ all of your own hooks, before your return statement
// eslint-disable-next-line consistent-return
export const useAuthRedirect = (): string | void => {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (user === null) {
    redirect(`/login?redirect=${encodeURIComponent(`${pathname}?${searchParams}`)}`)
  }

  if (!user) {
    return 'Loading...'
  }
}
