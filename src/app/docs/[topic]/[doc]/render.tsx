'use client'

import React, { useEffect } from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'
import { useTheme } from '@providers/Theme'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'

import { Button } from '@components/Button'
import { JumplistProvider } from '@components/Jumplist'
import components from '@components/MDX/components'
import TableOfContents from '@components/TableOfContents'
import slugify from '@root/utilities/slugify'
import { Doc, NextDoc } from '../../types'

import classes from './index.module.scss'

type Props = {
  doc: Doc
  next?: NextDoc
}

export const RenderDoc: React.FC<Props> = ({ doc, next }) => {
  const { content, headings, title } = doc
  const [OS, setOS] = React.useState('⌘')

  const theme = useTheme()

  React.useEffect(() => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    setOS(isMac ? '⌘' : 'CTRL')
  }, [])

  const openSearch = React.useCallback(() => {
    document.querySelector<HTMLButtonElement>('.DocSearch-Button').click()
  }, [])

  // Need this until Next #42414 is fixed
  useEffect(() => {
    document.title = `${title} | Documentation | Payload CMS`
  })

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
          {next && (
            <Link
              className={classes[`next--${theme}`]}
              href={`/docs/${next.topic.toLowerCase()}/${next.slug}`}
            >
              <div className={classes.nextLabel}>
                Next <ArrowIcon />
              </div>
              <h4>{next.title}</h4>
            </Link>
          )}
        </div>
        <aside className={classes.aside}>
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
        </aside>
      </div>
    </JumplistProvider>
  )
}
