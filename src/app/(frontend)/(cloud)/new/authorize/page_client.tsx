'use client'

import React, { useCallback } from 'react'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { fetchGithubTokenClient } from '@cloud/_api/fetchGitHubToken.js'
import Link from 'next/link'

import { useRouter, useSearchParams } from 'next/navigation'

import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { RenderParams } from '@components/RenderParams/index.js'
import { exchangeCode } from '@root/app/(frontend)/(cloud)/new/authorize/exchangeCode.js'
import { GitHubIcon } from '@root/graphics/GitHub/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { usePopupWindow } from '@root/utilities/use-popup-window.js'

import classes from './page.module.scss'

export const AuthorizePage: React.FC = () => {
  const router = useRouter()
  const params = useSearchParams()
  const redirectParam = params?.get('redirect')
  const teamParam = params?.get('team')
  const [isRedirecting, setRedirecting] = React.useState(false)
  const isRequesting = React.useRef(false)

  const redirectRef = React.useRef(
    `${redirectParam}` || `/new${teamParam ? `?team=${teamParam}` : ''}`,
  )

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
            await revalidateCache({
              tag: 'user',
            })

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
        <h2>{isRedirecting ? 'Redirecting, one moment...' : 'Authorize your Git provider'}</h2>
        {exchangeError && <div className={classes.error}>{exchangeError}</div>}
      </div>
      <a className={classes.ghLink} href={href} type="button" onClick={openPopupWindow}>
        <GitHubIcon className={classes.ghIcon} />
        <Heading element="h2" as="h4" margin={false} className={classes.ghTitle}>
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
