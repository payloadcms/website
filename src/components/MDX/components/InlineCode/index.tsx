import React from 'react'

import classes from './index.module.scss'

const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={classes.wrap}>
    <code>{children}</code>
  </span>
)

export default InlineCode
