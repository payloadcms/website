import React from 'react'
import Code from '../../../Code'
import classes from './index.module.scss'

const CodeMarkdown: React.FC<{ children: React.ReactNode; className: string }> = ({ children }) => {
  return <Code className={classes.code}>{(children as React.ReactElement).props.children}</Code>
}

export default CodeMarkdown
