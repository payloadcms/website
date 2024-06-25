'use client'
import React, { useEffect } from 'react'

import slugify from '../../../../utilities/slugify.js'
import { JumplistNode } from '../../../Jumplist/index.js'
import { useMDX } from '../../context.js'
import { formatAnchor } from './formatAnchor.js'

const H2: React.FC<{ children: string }> = ({ children }) => {
  const anchor = slugify(formatAnchor(children))
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
