import React from 'react'

import Code from '../../../Code'

import classes from './index.module.scss'

const CodeMarkdown: React.FC<{ children: React.ReactNode; className: string }> = ({ children }) => {
  let childrenToRender: string | null = null
  const blockRef = React.useRef<HTMLDivElement>(null)

  if (typeof children === 'string') {
    childrenToRender = children
  } else if (typeof children === 'number') {
    childrenToRender = String(children)
  } else if (typeof children === 'object' && children && 'props' in children) {
    childrenToRender = String(children.props.children)
  }

  if (childrenToRender === null) return null

  return (
    <div ref={blockRef} className={classes.codeWrap}>
      <Code className={`${classes.code} mdx-code`} disableMinHeight>
        {childrenToRender.trim()}
      </Code>
    </div>
  )
}

export default CodeMarkdown
