import { TextareaField } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

export const BlogMarkdownField: React.FC<{ name: string; path: string }> = ({ name, path }) => {
  return (
    <div className="markdown">
      <TextareaField field={{ name, required: true }} path={path} />
    </div>
  )
}
