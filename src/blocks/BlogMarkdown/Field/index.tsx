import { TextareaField } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

export const BlogMarkdownField: React.FC<{ name: string; path: string }> = ({ name, path }) => {
  return (
    <div className="markdown">
      <TextareaField name={name} path={path} required />
    </div>
  )
}
