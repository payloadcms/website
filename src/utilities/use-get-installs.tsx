import React, { useEffect } from 'react'

import { useAuth } from '@root/providers/Auth'

export interface Install {
  id: string
  account: {
    id: string
    login: string
  }
  html_url: string
}

export const useGetInstalls = (): {
  error: string | undefined
  loading: boolean
  installs: Install[]
} => {
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState(true)
  const [installs, setInstalls] = React.useState<Install[]>([])
  const { user } = useAuth()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user) {
      const getInstalls = async () => {
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
            route: `GET /user/installations`,
          }),
        })

        const res = await reposReq.json()

        if (reposReq.ok) {
          setInstalls(res.data?.installations)
          setError(undefined)
        } else {
          setError(res.error)
        }

        clearTimeout(timeout)
        setLoading(false)
      }

      getInstalls()
    }
  }, [user])

  return {
    installs,
    error,
    loading,
  }
}
