import React from 'react'
import { TextareaField } from '@payloadcms/ui'
import './index.scss'

export const BlogMarkdownField: React.FC<{ path: string; name: string }> = ({ path, name }) => {
  return (
    <div className="markdown">
      <TextareaField path={path} name={name} required />
    </div>
  )
}
