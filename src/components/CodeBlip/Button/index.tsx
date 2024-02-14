'use client'
import React from 'react'

import { GradientBorderIcon } from '@root/icons/GradientBorderIcon'
import { InfoIcon } from '@root/icons/InfoIcon'
import { CodeBlip } from '../../Code/types'
import { useCodeBlip } from '../CodeBlipContext'

import classes from './index.module.scss'

const CodeBlipButton: React.FC<{ blip: CodeBlip; index?: number; delay?: number }> = ({
  blip,
  index = 1,
  delay: delayFromProps = 500,
}) => {
  const { openModal } = useCodeBlip()

  const style = { '--animation-delay': `${delayFromProps * index}ms` } as React.CSSProperties

  return (
    <button onClick={() => openModal(blip)} className={classes.button} style={style}>
      <span className="visually-hidden">Code feature</span>
      <InfoIcon />
      <GradientBorderIcon className={classes.border} />
      <GradientBorderIcon className={classes.pulse} />
    </button>
  )
}

export default CodeBlipButton
