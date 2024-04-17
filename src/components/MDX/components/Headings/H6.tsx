import React, { useEffect } from 'react'

import slugify from '../../../../utilities/slugify'
import { JumplistNode } from '../../../Jumplist'
import { useMDX } from '../../context'
import { formatAnchor } from './formatAnchor'

const H6: React.FC<{ children: string }> = ({ children }) => {
  const anchor = slugify(formatAnchor(children))
  const { addHeading } = useMDX()

  useEffect(() => {
    addHeading(anchor, children, 'tertiary')
  }, [addHeading, anchor, children])

  return (
    <JumplistNode id={anchor} type="h6">
      {children}
    </JumplistNode>
  )
}

export default H6
