import React from 'react'

import Code from '../../../Code/index.js'

import classes from './index.module.scss'

const CodeMarkdown: (props) => React.JSX.Element | null = ({ children }) => {
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
    <Code parentClassName={classes.code} disableMinHeight>
      {childrenToRender.trim()}
    </Code>
  )
}

export default CodeMarkdown
