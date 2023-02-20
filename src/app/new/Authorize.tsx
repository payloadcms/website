import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './Authorize.module.scss'

export const Authorize: React.FC<{
  onAuthorize: (code?: string) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onAuthorize } = props

  const [href] = useState(
    `https://github.com/login/oauth/authorize?client_id=${
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
    )}&state=${encodeURIComponent(`/new/import`)}`,
  )

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        console.warn(`Message received by ${event.origin}; IGNORED.`)
        return
      }

      const code = event.data

      if (typeof onAuthorize === 'function') {
        onAuthorize(code)
      }
    }

    window.addEventListener('message', receiveMessage, false)

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [onAuthorize])

  const handleClick = useCallback(
    e => {
      e.preventDefault()

      const features = {
        popup: 'yes',
        width: 600,
        height: 700,
        top: 'auto',
        left: 'auto',
        toolbar: 'no',
        menubar: 'no',
      }

      const popupOptions = Object.entries(features)
        .reduce((str, [key, value]) => {
          let strCopy = str
          if (value === 'auto') {
            if (key === 'top') {
              const v = Math.round(window.innerHeight / 2 - features.height / 2)
              strCopy += `top=${v},`
            } else if (key === 'left') {
              const v = Math.round(window.innerWidth / 2 - features.width / 2)
              strCopy += `left=${v},`
            }
            return strCopy
          }

          strCopy += `${key}=${value},`
          return strCopy
        }, '')
        .slice(0, -1) // remove last ',' (comma)

      window.open(href, '_blank', popupOptions)
    },
    [href],
  )

  return (
    <Gutter>
      <a className={classes.ghLink} href={href} type="button" onClick={handleClick}>
        <GitHubIcon className={classes.ghIcon} />
        <Heading element="h2" as="h6" margin={false} className={classes.ghTitle}>
          Continue with GitHub
        </Heading>
        <ArrowIcon size="large" />
      </a>
      <div className={classes.footer}>
        <p>
          {`Don't have a project yet? `}
          <Link href="/new/clone">Create a new one</Link>
          {` from one of our templates.`}
        </p>
        <p>
          {`Don't see your Git provider available? More Git providers are on their way. `}
          <Link href="/contact">Send us a message</Link>
          {` and we'll see what we can do to expedite it.`}
        </p>
      </div>
    </Gutter>
  )
}
