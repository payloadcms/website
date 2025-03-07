'use client'

import type { StepsBlock } from '@root/payload-types'

import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { useInView } from 'framer-motion'
import React, { useRef } from 'react'

import classes from './index.module.scss'

type Props = {
  i: number
  step: StepsBlock['stepsFields']['steps'][0]
}

export const Step: React.FC<Props> = ({ i, step }) => {
  const { content, media } = step
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: '-160px 0px -160px 0px', once: true })

  return (
    <div
      className={[classes.stepContainer, isInView && classes.inView].filter(Boolean).join(' ')}
      ref={ref}
    >
      <span className={classes.pill}>Step {i + 1}</span>
      {content && <RichText className={classes.content} content={content} />}
      {media && typeof media !== 'string' && <Media className={classes.media} resource={media} />}
    </div>
  )
}
