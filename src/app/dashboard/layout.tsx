'use client'

import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { RouteCrumbs } from './_components/RouteCrumbs'
import { RouteDataProvider } from './context'

const AuthLayout = ({ children }) => {
  useAuthRedirect()

  return (
    <RouteDataProvider>
      <RouteCrumbs />

      {children}
    </RouteDataProvider>
  )
}

export default AuthLayout
