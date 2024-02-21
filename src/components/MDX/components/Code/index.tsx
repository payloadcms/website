import React from 'react'

import Code from '../../../Code'

import classes from './index.module.scss'

const CodeMarkdown: React.FC<{ children: React.ReactNode; className: string }> = ({ children }) => {
  let childrenToRender: string | null = null
  const [blockPadding, setBlockPadding] = React.useState(0)
  const blockRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (blockRef.current?.offsetWidth === undefined) return
    setBlockPadding(Math.round(blockRef.current?.offsetWidth / 10) - 2)
  }, [blockRef.current?.offsetWidth])

  if (typeof children === 'string') {
    childrenToRender = children
  } else if (typeof children === 'number') {
    childrenToRender = String(children)
  } else if (typeof children === 'object' && children && 'props' in children) {
    childrenToRender = String(children.props.children)
  }

  if (childrenToRender === null) return null

  return (
    <div
      ref={blockRef}
      style={{
        marginLeft: blockPadding / -1,
        marginRight: blockPadding / -1,
      }}
      className={classes.codeWrap}
    >
      <Code className={`${classes.code} mdx-code`} disableMinHeight>
        {childrenToRender.trim()}
      </Code>
    </div>
  )
}

export default CodeMarkdown
