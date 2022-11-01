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

type Props = {
  doc: Doc
}

export const DocTemplate: React.FC<Props> = ({ doc }) => {
  const {
    content,
    headings,
    data: { title },
  } = doc

  return (
    <JumplistProvider>
      <div className={classes.doc}>
        <div className={classes.content}>
          <h1 className={classes.title}>{title}</h1>
          <MDXRemote {...content} components={components} />
          {doc.next && (
            <Link
              className={classes.next}
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
        </aside>
      </div>
    </JumplistProvider>
  )
}
