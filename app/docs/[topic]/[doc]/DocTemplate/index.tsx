'use client'

import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import components from '../../../../../components/MDX/components'

export const DocTemplate: React.FC<{ content: any }> = ({ content }) => {
  return <MDXRemote {...content} components={components} />
}
