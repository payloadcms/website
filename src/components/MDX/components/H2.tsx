import React, { useEffect } from 'react'

import slugify from '../../../utilities/slugify'
import { JumplistNode } from '../../Jumplist'
import { useMDX } from '../context'

const H2: React.FC<{ children: string }> = ({ children }) => {
  const anchor = slugify(children)
  const { addHeading } = useMDX()

  useEffect(() => {
    addHeading(anchor, children, 'secondary')
  }, [addHeading, anchor, children])

  return (
    <JumplistNode id={anchor} type="h2">
      {children}
    </JumplistNode>
  )
}

export default H2
