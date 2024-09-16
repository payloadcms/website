'use client'

import React, { useEffect, useRef, useState } from 'react'
import useIntersection from '@utilities/useIntersection.js'

import { Gutter } from '@components/Gutter/index.js'
import { Label } from '@components/Label/index.js'
import { RenderBlocks } from '@components/RenderBlocks/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'steps' }>['stepsFields']['steps'][0] & {
  i: number
}

export const Step: React.FC<Props> = ({ layout, i }) => {
  const ref = useRef(null)
  const { isIntersecting } = useIntersection({ ref, rootMargin: '0% 0% -25% 0%' })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasAnimated) setHasAnimated(true)
  }, [isIntersecting, hasAnimated])

  if (layout) {
    return (
      <li
        className={[classes.step, hasAnimated && classes.animate].filter(Boolean).join(' ')}
        key={i}
        ref={ref}
      >
        <Gutter>
          <Label className={classes.label}>Step 0{i + 1}</Label>
        </Gutter>
        <RenderBlocks disableOuterSpacing blocks={layout} />
      </li>
    )
  }

  return null
}
