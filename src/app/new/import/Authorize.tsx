import React from 'react'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './Authorize.module.scss'

export const Authorize: React.FC = () => {
  return (
    <Gutter>
      <a
        className={classes.ghLink}
        href={`https://github.com/login/oauth/authorize?client_id=${
          process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        }&redirect_uri=${encodeURIComponent(
          process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
        )}&state=${encodeURIComponent(`/new/import`)}`}
        type="button"
      >
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
