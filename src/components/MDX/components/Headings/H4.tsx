'use client'
import React, { useEffect } from 'react'

import slugify from '../../../../utilities/slugify.js'
import { JumplistNode } from '../../../Jumplist/index.js'
import { useMDX } from '../../context.js'
import { formatAnchor } from './formatAnchor.js'

const H4: (props: { children }) => React.JSX.Element = ({ children }) => {
  const anchor = slugify(formatAnchor(children))
  const { addHeading } = useMDX()

  useEffect(() => {
    addHeading(anchor, children, 'tertiary')
  }, [addHeading, anchor, children])

  return (
    <JumplistNode id={anchor} type="h4">
      {children}
    </JumplistNode>
  )
}

export default H4
