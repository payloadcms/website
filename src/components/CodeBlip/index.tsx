'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, transform, useInView, useScroll } from 'framer-motion'

import { RichText } from '@components/RichText'
import { GradientBorderIcon } from '@root/icons/GradientBorderIcon'
import { InfoIcon } from '@root/icons/InfoIcon'
import { CodeBlip, Props } from '../Code/types'

import classes from './index.module.scss'

const CodeBlip: React.FC<{ blip: CodeBlip }> = ({ blip }) => {
  const [active, setActive] = useState(false)

  return (
    <>
      <button onClick={() => setActive(!active)} className={classes.button}>
        <span className="visually-hidden">Code feature</span>
        {/* <InfoIcon /> */}
        <GradientBorderIcon className={classes.pulse} />
      </button>
      <div className={classes.codeFeature}>
        <div className={[classes.content, active && classes.active].filter(Boolean).join(' ')}>
          <RichText content={blip.feature} />
        </div>
      </div>
    </>
  )
}

export default CodeBlip
