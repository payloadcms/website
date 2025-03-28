'use client'

import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { fetchGithubTokenClient } from '@cloud/_api/fetchGitHubToken'
import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { RenderParams } from '@components/RenderParams/index'
import { exchangeCode } from '@root/app/(frontend)/(cloud)/new/authorize/exchangeCode'
import { GitHubIcon } from '@root/graphics/GitHub/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { getSafeRedirect } from '@root/utilities/getSafeRedirect'
import { usePopupWindow } from '@root/utilities/use-popup-window'
import { uuid as generateUUID } from '@root/utilities/uuid'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'

import classes from './page.module.scss'

export const AuthorizePage: React.FC = () => {
  const router = useRouter()
  const params = useSearchParams()
  const redirectParam = params?.get('redirect')
  const teamParam = params?.get('team')
  const uuid = params?.get('uuid') || generateUUID()
  const [isRedirecting, setRedirecting] = React.useState(false)
  const isRequesting = React.useRef(false)

  const redirectRef = React.useRef(
    getSafeRedirect(redirectParam || `/new${teamParam ? `?team=${teamParam}` : ''}`),
  )

  // Set uuid in local storage and pass through with state. To be validated later.
  localStorage.setItem(`gh-redirect-uuid`, uuid)

  const href = `https://github.com/login/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || '',
  )}&state=${encodeURIComponent(`/new/import?uuid=${uuid}${teamParam ? `&team=${teamParam}` : ''}`)}`

  const [exchangeError, setExchangeError] = React.useState<null | string>(null)

  const handleMessage = useCallback(
    async ({ code, state }) => {
      if (isRequesting.current) {
        return
      }

      isRequesting.current = true
      setRedirecting(true)

      try {
        const ghRedirectUUID = localStorage.getItem(`gh-redirect-uuid`)
        // Parse state value from github, which looks like `/new/import?uuid=1234`
        const parsed = new URLSearchParams(state.split('?')?.[1])
        const parsedUUID = parsed.get('uuid')
        if (!parsedUUID || !ghRedirectUUID || ghRedirectUUID !== parsedUUID) {
          console.error(
            `UUID mismatch: ${ghRedirectUUID} !== ${parsedUUID}. Incoming state: ${state}`,
          )
          throw new Error(`UUID mismatch`)
        }

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
    eventType: 'github',
    href,
    onMessage: handleMessage,
  })

  return (
    <Gutter>
      <div className={classes.header}>
        <RenderParams />
        <h2>{isRedirecting ? 'Redirecting, one moment...' : 'Authorize your Git provider'}</h2>
        {exchangeError && <div className={classes.error}>{exchangeError}</div>}
      </div>
      <a className={classes.ghLink} href={href} onClick={openPopupWindow} type="button">
        <GitHubIcon className={classes.ghIcon} />
        <Heading as="h4" className={classes.ghTitle} element="h2" margin={false}>
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
