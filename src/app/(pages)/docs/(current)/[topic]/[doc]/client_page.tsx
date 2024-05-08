'use client'

import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'

import { BackgroundScanline } from '@components/BackgroundScanline'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { JumplistProvider } from '@components/Jumplist'
import components from '@components/MDX/components'
import { RelatedHelpList } from '@components/RelatedHelpList'
import TableOfContents from '@components/TableOfContents'
import { VersionBanner } from '@components/VersionBanner'
import { VersionSelector } from '@components/VersionSelector'
import { CommunityHelp } from '@root/payload-types'
import slugify from '@root/utilities/slugify'
import { Doc, NextDoc } from '../../../types'

import classes from './index.module.scss'

type Props = {
  doc: Doc
  next?: NextDoc | null
  relatedThreads?: CommunityHelp[]
  version?: 'current' | 'legacy' | 'beta'
}

export const RenderDoc: React.FC<Props> = ({ doc, next, relatedThreads, version = 'current' }) => {
  const { content, headings, title } = doc
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
        <div className={classes.mdx}>
          <MDXRemote {...content} components={components} />
        </div>
        {next && (
          <Link
            className={[classes.next, hasRelatedThreads && classes.hasRelatedThreads]
              .filter(Boolean)
              .join(' ')}
            href={`/docs/${next.topic.toLowerCase()}/${next.slug}`}
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
          <TableOfContents headings={headings} />
          <div className={classes.discordGitWrap}>
            <DiscordGitCTA style="minimal" />
          </div>
          {!hideVersionSelector && (
            <div className={classes.selector}>
              <VersionSelector initialVersion={version} />
            </div>
          )}
        </div>
      </div>
    </JumplistProvider>
  )
}
