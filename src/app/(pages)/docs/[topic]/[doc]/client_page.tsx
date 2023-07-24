'use client'

import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'

import { Button } from '@components/Button'
import { JumplistProvider } from '@components/Jumplist'
import components from '@components/MDX/components'
import { RelatedHelpList } from '@components/RelatedHelpList'
import TableOfContents from '@components/TableOfContents'
import slugify from '@root/utilities/slugify'
import { Doc, NextDoc } from '../../types'

import classes from './index.module.scss'

type Props = {
  doc: Doc
  next?: NextDoc | null
}

export const RenderDoc: React.FC<Props> = ({ doc, next }) => {
  const { content, headings, title } = doc
  const [OS, setOS] = React.useState('⌘')

  React.useEffect(() => {
    const isMac =
      // @ts-ignore (newer browsers only)
      (navigator?.userAgentData?.platform &&
        // @ts-ignore
        navigator.userAgentData.platform.toUpperCase().indexOf('MAC') >= 0) ||
      // @ts-ignore (older browsers only)
      navigator.userAgent.toUpperCase().indexOf('MAC') >= 0 ||
      // @ts-ignore (older browsers only)
      (navigator?.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0)

    setOS(isMac ? '⌘' : 'CTRL')
  }, [])

  const openSearch = React.useCallback(() => {
    document?.querySelector<HTMLButtonElement>('.DocSearch-Button')?.click()
  }, [])

  return (
    <JumplistProvider>
      <div className={classes.doc}>
        <div className={classes.content} id="doc">
          <h1 id={slugify(title)} className={classes.title}>
            {title}
          </h1>
          <div className={classes.mdx}>
            <MDXRemote {...content} components={components} />
          </div>
          <RelatedHelpList />
          {next && (
            <Link
              className={classes.next}
              href={`/docs/${next.topic.toLowerCase()}/${next.slug}`}
              data-algolia-no-crawl
              prefetch={false}
            >
              <div className={classes.nextLabel}>
                Next <ArrowIcon />
              </div>
              <h4>{next.title}</h4>
            </Link>
          )}
        </div>
        <aside className={classes.aside}>
          <div className={classes.asideStickyContent}>
            <TableOfContents headings={headings} />
            <Button
              appearance="default"
              el="a"
              href="https://discord.com/invite/r6sCXqVk3v"
              newTab
              label="Join us on Discord"
              labelStyle="mono"
              icon="arrow"
            />
            <Button
              className={classes.search}
              onClick={openSearch}
              appearance="default"
              el="button"
              label={`Press ${OS}+K to search`}
              labelStyle="mono"
              icon="search"
            />
          </div>
        </aside>
      </div>
    </JumplistProvider>
  )
}
