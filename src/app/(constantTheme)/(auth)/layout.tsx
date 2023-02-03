'use client'

import { useAuthRedirect } from '@root/utilities/use-auth-redirect'

const AuthLayout = ({ children }) => {
  useAuthRedirect()

  return children
}

export default AuthLayout
