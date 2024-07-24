'use client'
import React from 'react'

import { GradientBorderIcon } from '@root/icons/GradientBorderIcon/index.js'
import { PlusIcon } from '@root/icons/PlusIcon/index.js'
import { CodeBlip } from '../../Code/types.js'
import { useCodeBlip } from '../CodeBlipContext.js'

import classes from './index.module.scss'

const CodeBlipButton: React.FC<{ blip: CodeBlip; index?: number; delay?: number }> = ({
  blip,
  index = 1,
  delay: delayFromProps = 500,
}) => {
  const { isOpen, openModal } = useCodeBlip()

  const style = { '--animation-delay': `${delayFromProps * index}ms` } as React.CSSProperties

  return (
    <button
      onClick={() => openModal(blip)}
      aria-pressed={isOpen}
      className={[classes.button, isOpen && classes.hidden].filter(Boolean).join(' ')}
      style={style}
    >
      <span className="visually-hidden">Code feature</span>
      <PlusIcon />
      <GradientBorderIcon className={classes.border} />
      <GradientBorderIcon className={classes.pulse} />
      <span className={classes.hoverBg} />
    </button>
  )
}

export default CodeBlipButton
