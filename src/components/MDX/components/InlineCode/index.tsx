import React from 'react'

import classes from './index.module.scss'

const InlineCode: (props) => React.JSX.Element = ({ children }) => (
  <span className={classes.wrap}>
    <code>{children}</code>
  </span>
)

export default InlineCode
