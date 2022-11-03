'use client'

import React from 'react'

import classes from './index.module.scss'
import { CustomRenderers, Serialize } from './Serialize'

export const RichText: React.FC<{
  className?: string
  content: any
  customRenderers?: CustomRenderers
}> = ({ className, content, customRenderers }) => {
  if (!content) {
    return null
  }

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      <Serialize content={content} customRenderers={customRenderers} />
    </div>
  )
}
