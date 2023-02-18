import React, { useEffect } from 'react'

import { useAuth } from '@root/providers/Auth'
import { Install } from './use-get-installs'

export interface Repo {
  id: string
  name: string
}
export const useGetRepos = (props: {
  selectedInstall: Install | undefined
}): {
  error: string | undefined
  loading: boolean
  repos: Repo[]
} => {
  const { selectedInstall } = props
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState(true)
  const [repos, setRepos] = React.useState<Repo[]>([])
  const { user } = useAuth()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user && selectedInstall) {
      const getRepos = async () => {
        timeout = setTimeout(() => {
          setLoading(true)
        }, 250)

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
          setRepos(res.data?.repositories)
          setError(undefined)
        } else {
          setError(res.error)
        }

        clearTimeout(timeout)
        setLoading(false)
      }

      getRepos()
    }
  }, [user, selectedInstall])

  return {
    repos,
    error,
    loading,
  }
}
