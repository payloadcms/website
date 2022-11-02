'use client'

import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import Link from 'next/link'
import components from '../../../../../components/MDX/components'
import { Doc, NextDoc } from '../types'
import TableOfContents from '../../../../../components/TableOfContents'
import classes from './index.module.scss'
import { JumplistProvider } from '../../../../../components/Jumplist'
import { ArrowIcon } from '../../../../../components/icons/ArrowIcon'
import { useTheme } from '../../../../../components/providers/Theme'
import { Button } from '../../../../../components/Button'

type Props = {
  doc: Doc
  next?: NextDoc
}

export const DocTemplate: React.FC<Props> = ({ doc, next }) => {
  const {
    content,
    headings,
    data: { title },
  } = doc

  const theme = useTheme()

  return (
    <JumplistProvider>
      <div className={classes.doc}>
        <div className={classes.content}>
          <h1 className={classes.title}>{title}</h1>
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
            appearance="default"
            el="button"
            label="Press ⌘K to search"
            labelStyle="mono"
            icon="search"
          />
        </aside>
      </div>
    </JumplistProvider>
  )
}
