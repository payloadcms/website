'use client'
import { GradientBorderIcon } from '@root/icons/GradientBorderIcon/index'
import { PlusIcon } from '@root/icons/PlusIcon/index'
import React from 'react'

import type { CodeBlip } from '../../Code/types'

import { useCodeBlip } from '../CodeBlipContext'
import classes from './index.module.scss'

const CodeBlipButton: React.FC<{ blip: CodeBlip; delay?: number; index?: number }> = ({
  blip,
  delay: delayFromProps = 500,
  index = 1,
}) => {
  const { isOpen, openModal } = useCodeBlip()

  const style = { '--animation-delay': `${delayFromProps * index}ms` } as React.CSSProperties

  return (
    <button
      aria-pressed={isOpen}
      className={[classes.button, isOpen && classes.hidden].filter(Boolean).join(' ')}
      onClick={() => openModal(blip)}
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
