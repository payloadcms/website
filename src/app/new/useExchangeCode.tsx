import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import { useAuth } from '@root/providers/Auth'

export const useExchangeCode = (): {
  error: string
  hasAuthorizedGithub: boolean
} => {
  const params = useSearchParams()
  const { user } = useAuth()
  const hasRequestedGithub = useRef(false)
  const [error, setError] = React.useState('')
  const [hasAuthorizedGithub, setHasAuthorizedGithub] = React.useState(false)

  useEffect(() => {
    const code = params.get('code')

    if (user && code && !hasRequestedGithub.current) {
      hasRequestedGithub.current = true

      const exchangeCode = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/gh?code=${code}`, {
            method: 'GET',
            credentials: 'include',
          })

          const body = await res.json()

          if (res.ok) {
            setHasAuthorizedGithub(true)

            // do more async stuff
          } else {
            setError(`Unable to authorize GitHub: ${body.error}`)
          }
        } catch (err) {
          console.error(err)
          setError(err.message)
        }
      }

      exchangeCode()
    }
  }, [user, params])

  useEffect(() => {
    const code = params.get('code')

    if (user && code && !hasRequestedGithub.current) {
      hasRequestedGithub.current = true

      const exchangeCode = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/gh?code=${code}`, {
            method: 'GET',
            credentials: 'include',
          })

          const body = await res.json()

          if (res.ok) {
            setHasAuthorizedGithub(true)

            // do more async stuff
          } else {
            setError(`Unable to authorize GitHub: ${body.error}`)
          }
        } catch (err) {
          console.error(err)
          setError(err.message)
        }
      }

      exchangeCode()
    }
  }, [user, params])

  return { error, hasAuthorizedGithub }
}
