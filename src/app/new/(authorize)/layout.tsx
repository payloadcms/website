'use client'

import * as React from 'react'
import { redirect, usePathname } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useAuth } from '@root/providers/Auth'
import { useCheckToken } from '@root/utilities/use-check-token'
import useDebounce from '@root/utilities/use-debounce'
import { useExchangeCode } from '@root/utilities/use-exchange-code'
import { Authorize } from './Authorize'

const AllProjectsLayout = ({ children }) => {
  const pathname = usePathname()
  const { user } = useAuth()

  const { error: exchangeError, hasExchangedCode, exchangeCode } = useExchangeCode()

  const {
    tokenIsValid,
    loading: tokenLoading,
    error,
  } = useCheckToken({
    hasExchangedCode,
  })

  const loading = useDebounce(tokenLoading, 250)

  if (user === undefined) return null

  if (user === null)
    redirect(
      `/login?redirect=${encodeURIComponent(pathname)}&message=${encodeURIComponent(
        'You must first login to clone this template.',
      )}`,
    )

  if (!loading && !error && tokenIsValid) {
    return <React.Fragment>{children}</React.Fragment>
  }

  return (
    <React.Fragment>
      <Gutter>
        {!loading && (error || !tokenIsValid) && <h1>Authorize with GitHub</h1>}
        {loading && <LoadingShimmer number={3} />}
        {exchangeError && <p>{exchangeError}</p>}
      </Gutter>
      {!loading && (error || !tokenIsValid) && (
        <Authorize
          onAuthorize={({ code }) => {
            exchangeCode(code)
          }}
        />
      )}
    </React.Fragment>
  )
}

export default AllProjectsLayout
