'use client'

import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import Link from 'next/link'
import components from '../../../../../components/MDX/components'
import { Doc } from '../types'
import TableOfContents from '../../../../../components/TableOfContents'
import classes from './index.module.scss'
import { JumplistProvider } from '../../../../../components/Jumplist'
import { ArrowIcon } from '../../../../../components/icons/ArrowIcon'
import { useTheme } from '../../../../../components/providers/Theme'
import { Button } from '../../../../../components/Button'

type Props = {
  doc: Doc
}

export const DocTemplate: React.FC<Props> = ({ doc }) => {
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
          {doc.next && (
            <Link
              className={classes[`next--${theme}`]}
              href={`/docs/${doc.next.topic.toLowerCase()}/${doc.next.slug}`}
            >
              <div className={classes.nextLabel}>
                Next <ArrowIcon />
              </div>
              <h4>{doc.next.title}</h4>
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
            label="Press / to search"
            labelStyle="mono"
            icon="search"
          />
        </aside>
      </div>
    </JumplistProvider>
  )
}
