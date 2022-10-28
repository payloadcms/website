import React from 'react'

import classes from './index.module.scss'
import { Serialize } from './Serialize'

const RichText: React.FC<{
  className?: string
  content: any
}> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      <Serialize content={content} />
    </div>
  )
}

export default RichText
