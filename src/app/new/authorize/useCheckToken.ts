import React, { useEffect, useRef, useState } from 'react'
import type { Endpoints } from '@octokit/types'

import { useAuth } from '@root/providers/Auth'

type GitHubResponse = Endpoints['GET /user']['response']

export const useCheckToken = (props?: {
  hasExchangedCode?: boolean
}): {
  loading: boolean
  error: string | undefined
  tokenIsValid: boolean
} => {
  const { hasExchangedCode } = props || {}
  const hasMadeRequest = useRef(false)

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = React.useState<string | undefined>('')
  const [tokenIsValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // run this when the user initially logs in and also when they exchange the code
    // this is because the initial response may be a 401 if the user has not authorized
    // in this scenario we want to show the `Authorize` component
    // this component will redirect them to GitHub then back to this page with a `code` param
    // the `useExchangeCode` hook will then exchange the code for an access token
    // once the access token is received we can fetch the user's repos once again
    if (user && (!hasMadeRequest.current || hasExchangedCode)) {
      hasMadeRequest.current = true

      timeout = setTimeout(() => {
        setLoading(true)
      }, 250)

      try {
        const checkToken = async (): Promise<void> => {
          const reposReq = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                route: `GET /user`,
              }),
            },
          )

          const res: GitHubResponse = await reposReq.json()

          if (reposReq.ok) {
            setIsTokenValid(true)
            setError(undefined)
          } else {
            setError(`Error getting repos: ${res.status}`)
          }

          clearTimeout(timeout)
          setLoading(false)
        }

        checkToken()
      } catch (err: unknown) {
        const message = `Unable to authorize GitHub: ${err}`
        console.error(message) // eslint-disable-line no-console
        setError(message)
        clearTimeout(timeout)
        setLoading(false)
      }
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [user, hasExchangedCode])

  return {
    loading,
    error,
    tokenIsValid,
  }
}
