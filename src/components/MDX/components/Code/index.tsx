import React from 'react'

import Code from '../../../Code'

import classes from './index.module.scss'

const CodeMarkdown: React.FC<{ children: React.ReactNode; className: string }> = ({ children }) => {
  let childrenToRender: string | null = null

  if (typeof children === 'string') {
    childrenToRender = children
  } else if (typeof children === 'number') {
    childrenToRender = String(children)
  } else if (typeof children === 'object' && children && 'props' in children) {
    childrenToRender = String(children.props.children)
  }

  if (childrenToRender === null) return null

  return (
    <div className={classes.code}>
      <Code className={classes.codeComponent}>{childrenToRender}</Code>
    </div>
  )
}

export default CodeMarkdown
