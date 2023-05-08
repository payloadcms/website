'use client'

import React from 'react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useCheckToken } from '@root/app/new/authorize/useCheckToken'
import { useExchangeCode } from '@root/app/new/authorize/useExchangeCode'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { usePopupWindow } from '@root/utilities/use-popup-window'

import classes from './index.module.scss'

export const AuthorizePage: React.FC = () => {
  useAuthRedirect()

  const params = useSearchParams()
  const { error: exchangeError, hasExchangedCode, exchangeCode } = useExchangeCode()

  const {
    tokenIsValid,
    // loading: tokenLoading,
    // no need to display this error to the user
    // simply present the with the authorize button
    // error: tokenError,
  } = useCheckToken({
    hasExchangedCode,
  })

  const teamParam = params?.get('team')

  const href = `https://github.com/login/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || '',
  )}&state=${encodeURIComponent(`/new/import${teamParam ? `?team=${teamParam}` : ''}`)}`

  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github',
    onMessage: async ({ code }) => exchangeCode(code),
  })

  if (tokenIsValid) {
    redirect(params?.get('redirect') || `/new${teamParam ? `?team=${teamParam}` : ''}`)
  }

  return (
    <Gutter>
      <div className={classes.header}>
        <Heading element="h1" as="h2" marginTop={false}>
          {params?.get('title') || 'Authorize your Git provider'}
        </Heading>
        {exchangeError && <div className={classes.error}>{exchangeError}</div>}
      </div>
      <a className={classes.ghLink} href={href} type="button" onClick={openPopupWindow}>
        <GitHubIcon className={classes.ghIcon} />
        <Heading element="h2" as="h6" margin={false} className={classes.ghTitle}>
          Continue with GitHub
        </Heading>
        <ArrowIcon size="large" />
      </a>
      <div className={classes.footer}>
        <p>
          {`Don't see your Git provider available? More Git providers are on their way. `}
          <Link href="/contact">Send us a message</Link>
          {` and we'll see what we can do to expedite it.`}
        </p>
      </div>
    </Gutter>
  )
}
