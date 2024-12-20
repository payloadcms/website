import React from 'react'

import Code from '../../../Code/index.js'
import classes from './index.module.scss'

const CodeMarkdown: (props) => null | React.JSX.Element = ({ children }) => {
  let childrenToRender: null | string = null

  if (typeof children === 'string') {
    childrenToRender = children
  } else if (typeof children === 'number') {
    childrenToRender = String(children)
  } else if (typeof children === 'object' && children && 'props' in children) {
    childrenToRender = String(children.props.children)
  }

  if (childrenToRender === null) {return null}

  return (
    <Code disableMinHeight parentClassName={classes.code}>
      {childrenToRender.trim()}
    </Code>
  )
}

export default CodeMarkdown
