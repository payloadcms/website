import React, { useEffect, useRef, useState } from 'react'
import { Page } from '@root/payload-types'
import { RenderBlocks } from '@components/RenderBlocks'
import { Label } from '@components/Label'
import { Gutter } from '@components/Gutter'
import useIntersection from '@root/utilities/useIntersection'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'steps' }>['stepsFields']['steps'][0] & {
  i: number
}

export const Step: React.FC<Props> = ({ layout, i }) => {
  const ref = useRef()
  const { isIntersecting } = useIntersection({ ref, rootMargin: '0% 0% -25% 0%' })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasAnimated) setHasAnimated(true)
  }, [isIntersecting])

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
