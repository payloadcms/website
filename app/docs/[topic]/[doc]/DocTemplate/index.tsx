'use client'

import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import components from '../../../../../components/MDX/components'
import classes from './index.module.scss'

export const DocTemplate: React.FC<{ title: string; content: any }> = ({ title, content }) => {
  return (
    <React.Fragment>
      <h1 className={classes.title}>{title}</h1>
      <MDXRemote {...content} components={components} />
    </React.Fragment>
  )
}
