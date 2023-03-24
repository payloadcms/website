import React, { useCallback, useRef } from 'react'

import { useAuth } from '@root/providers/Auth'

export const useExchangeCode = (): {
  error: string
  hasExchangedCode: boolean
  exchangeCode: (code?: string) => void // eslint-disable-line no-unused-vars
} => {
  const { user } = useAuth()
  const hasRequestedGithub = useRef(false)
  const [error, setError] = React.useState('')
  const [hasExchangedCode, setHasExchangedCode] = React.useState(false)

  const exchangeCode = useCallback(
    (code: string) => {
      if (user && code && !hasRequestedGithub.current) {
        hasRequestedGithub.current = true

        const doExchange = async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/exchange-code?code=${code}`,
              {
                method: 'GET',
                credentials: 'include',
              },
            )

            const body = await res.json()

            if (res.ok) {
              setHasExchangedCode(true)

              // do more async stuff
            } else {
              setError(`Unable to authorize GitHub: ${body.error}`)
            }
          } catch (err) {
            console.error(err) // eslint-disable-line no-console
            setError(err.message)
          }
        }

        doExchange()
      }
    },
    [user],
  )

  return { error, hasExchangedCode, exchangeCode }
}
