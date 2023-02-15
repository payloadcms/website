import { fetchMe } from '@rsc-api/cloud'
import { redirect } from 'next/navigation'

const AuthLayout = async ({ children }) => {
  const me = await fetchMe()

  if (!me) return redirect('/login')

  return children
}

export default AuthLayout
