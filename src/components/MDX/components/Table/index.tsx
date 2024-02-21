import React from 'react'

import classes from './index.module.scss'

// TODO: Needed to stub this out to be able to build
const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blockPadding, setBlockPadding] = React.useState(0)
  const blockRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (blockRef.current?.offsetWidth === undefined) return
    setBlockPadding(Math.round(blockRef.current?.offsetWidth / 10) - 2)
  }, [blockRef.current?.offsetWidth])

  return (
    <div
      className={classes.wrap}
      ref={blockRef}
      style={{
        marginLeft: blockPadding / -1,
        marginRight: blockPadding / -1,
        paddingLeft: blockPadding,
        paddingRight: blockPadding,
      }}
    >
      <table>{children}</table>
    </div>
  )
}

export default Table
