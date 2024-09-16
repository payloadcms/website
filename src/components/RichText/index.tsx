import React from 'react'

import classes from './index.module.scss'
import { serializeLexical } from './serialize'

type Props = {
  className?: string
  content: any
}

export const RichText: React.FC<Props> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}{' '}
    </div>
  )
}

export default RichText
