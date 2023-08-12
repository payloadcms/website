'use client'

import React, { useCallback } from 'react'
import { fetchGithubTokenClient } from '@cloud/_api/fetchGitHubToken'
import Link from 'next/link'
import { redirect, useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { RenderParams } from '@root/app/_components/RenderParams'
import { exchangeCode } from '@root/app/new/authorize/exchangeCode'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { usePopupWindow } from '@root/utilities/use-popup-window'

import classes from './page.module.scss'

export const AuthorizePage: React.FC<{
  githubToken: string | null
}> = ({ githubToken }) => {
  const router = useRouter()
  const params = useSearchParams()
  const redirectParam = params?.get('redirect')
  const teamParam = params?.get('team')
  const [isRedirecting, setRedirecting] = React.useState(false)
  const isRequesting = React.useRef(false)

  const redirectRef = React.useRef(
    `${redirectParam}` || `/new${teamParam ? `?team=${teamParam}` : ''}`,
  )

  // immediately redirect if we have a token
  if (githubToken) {
    redirect(redirectRef.current)
  }

  const href = `https://github.com/login/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || '',
  )}&state=${encodeURIComponent(`/new/import${teamParam ? `?team=${teamParam}` : ''}`)}`

  const [exchangeError, setExchangeError] = React.useState<string | null>(null)

  const handleMessage = useCallback(
    async ({ code }) => {
      if (isRequesting.current) {
        return
      }

      isRequesting.current = true
      setRedirecting(true)

      try {
        const codeExchanged = await exchangeCode(code)

        if (codeExchanged) {
          const token = await fetchGithubTokenClient()

          if (token) {
            router.push(redirectRef.current)
          } else {
            throw new Error(`Code exchange succeeded but token fetch failed`)
          }
        } else {
          throw new Error(`Code exchange failed`)
        }
      } catch (error) {
        setExchangeError(`There was an error exchanging your code for a token: ${error.message}`)
        setRedirecting(false)
      }
    },
    [router],
  )

  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github',
    onMessage: handleMessage,
  })

  return (
    <Gutter>
      <div className={classes.header}>
        <RenderParams />
        <Heading element="h1" as="h2" marginTop={false}>
          {isRedirecting ? 'Redirecting, one moment...' : 'Authorize your Git provider'}
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
          <Link href="/contact" prefetch={false}>
            Send us a message
          </Link>
          {` and we'll see what we can do to expedite it.`}
        </p>
      </div>
    </Gutter>
  )
}
