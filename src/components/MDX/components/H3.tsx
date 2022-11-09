import React, { useEffect } from 'react'
import slugify from '../../../utilities/slugify'
import { JumplistNode } from '../../Jumplist'
import { useMDX } from '../context'

const H3: React.FC<{ children: string }> = ({ children }) => {
  const anchor = slugify(children)
  const { addHeading } = useMDX()

  useEffect(() => {
    addHeading(anchor, children, 'tertiary')
  }, [addHeading, anchor, children])

  return (
    <JumplistNode id={anchor}>
      <h3>{children}</h3>
    </JumplistNode>
  )
}

export default H3
