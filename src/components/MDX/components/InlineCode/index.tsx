import React from 'react'

import classes from './index.module.scss'

const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={classes.wrap}>
    <code>{children}</code>
  </div>
)

export default InlineCode
