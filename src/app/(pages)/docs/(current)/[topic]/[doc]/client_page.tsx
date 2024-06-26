'use client'

import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import Link from 'next/link'

import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import DiscordGitCTA from '@components/DiscordGitCTA/index.js'
import { JumplistProvider } from '@components/Jumplist/index.js'
import { RelatedHelpList } from '@components/RelatedHelpList/index.js'
import TableOfContents from '@components/TableOfContents/index.js'
import { VersionBanner } from '@components/VersionBanner/index.js'
import { VersionSelector } from '@components/VersionSelector/index.js'
import { CommunityHelp } from '@root/payload-types.js'
import slugify from '@root/utilities/slugify.js'
import { Doc, NextDoc } from '../../../types.js'

import classes from './index.module.scss'

type Props = {
  doc: Doc
  next?: NextDoc | null
  relatedThreads?: CommunityHelp[]
  version?: 'current' | 'v2' | 'beta'
  children: React.ReactNode
}

export const RenderDoc: React.FC<Props> = ({
  doc,
  next,
  relatedThreads,
  version = 'current',
  children,
}) => {
  const { headings, title } = doc
  const docRef = React.useRef<HTMLDivElement>(null)

  const hideVersionSelector =
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true' &&
    process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true'

  const hasRelatedThreads =
    relatedThreads && Array.isArray(relatedThreads) && relatedThreads.length > 0

  return (
    <JumplistProvider>
      <div
        className={['cols-8 start-5 start-m-1', classes.content].join(' ')}
        id="doc"
        ref={docRef}
      >
        <VersionBanner />
        <h1 id={slugify(title)} className={classes.title}>
          {title}
        </h1>
        <div className={classes.mdx}>{children}</div>
        {next && (
          <Link
            className={[classes.next, hasRelatedThreads && classes.hasRelatedThreads]
              .filter(Boolean)
              .join(' ')}
            href={`/docs${version !== 'current' ? `/${version}` : ''}/${next.topic.toLowerCase()}/${
              next.slug
            }`}
            data-algolia-no-crawl
            prefetch={false}
          >
            <div className={classes.nextLabel}>
              Next <ArrowIcon />
            </div>
            <h3>{next.title}</h3>

            <BackgroundScanline crosshairs="all" />
          </Link>
        )}
        {hasRelatedThreads && <RelatedHelpList relatedThreads={relatedThreads} />}
      </div>
      <div className={['cols-3 start-14', classes.aside].join(' ')}>
        <div className={classes.asideStickyContent}>
          {!hideVersionSelector && (
            <div className={classes.selector}>
              <VersionSelector initialVersion={version} />
            </div>
          )}
          <TableOfContents headings={headings} />
          <div className={classes.discordGitWrap}>
            <DiscordGitCTA style="minimal" />
          </div>
        </div>
      </div>
    </JumplistProvider>
  )
}
