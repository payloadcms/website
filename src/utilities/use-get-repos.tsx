import React, { useEffect } from 'react'

import { useAuth } from '@root/providers/Auth'
import { Install } from './use-get-installs'

export interface Repo {
  name: string
  full_name: string
  id?: string // applies only to the `import` flow
  description?: string
}
export const useGetRepos = (props: {
  selectedInstall: Install | undefined
  delay?: number
}): {
  error: string | undefined
  loading: boolean
  repos: Repo[]
} => {
  const { selectedInstall, delay = 250 } = props
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [repos, setRepos] = React.useState<Repo[]>([])
  const { user } = useAuth()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user && selectedInstall) {
      setLoading(true)
      setError(undefined)

      const getRepos = async () => {
        const reposReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: `GET /user/installations/${selectedInstall.id}/repositories`,
          }),
        })

        const res = await reposReq.json()

        if (reposReq.ok) {
          timeout = setTimeout(() => {
            setRepos(res.data?.repositories)
            setLoading(false)
            setError(undefined)
          }, delay)
        } else {
          setError(res.error)
          setLoading(false)
        }
      }

      getRepos()
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [user, selectedInstall, delay])

  return {
    repos,
    error,
    loading,
  }
}
