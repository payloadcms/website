'use client'
import React, { useMemo } from 'react'
import { cubicBezier, motion, stagger, useAnimate, useInView } from 'framer-motion'

import classes from './index.module.scss'

interface Props {
  text: string
  as?: 'h1' | 'h2' | 'span'
}
const SplitAnimate: React.FC<Props> = ({ text, as: Element = 'span' }) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  const easing = cubicBezier(0.165, 0.84, 0.44, 1)

  const textArray = useMemo(() => {
    if (text === '') return []
    return text.split(' ')
  }, [text])

  const innerWorldSelector = `.${classes.innerWord}`

  React.useEffect(() => {
    if (isInView) {
      animate(
        innerWorldSelector,
        { y: '0%', rotate: 0 },
        { duration: 1.125, delay: stagger(0.075), ease: easing },
      )
    }
  }, [isInView])

  return (
    <Element ref={scope}>
      {textArray.map((text, index) => {
        return (
          <span className={classes.word} key={index}>
            <motion.span initial={{ y: '150%', rotate: 10 }} className={classes.innerWord}>
              {text}
            </motion.span>
          </span>
        )
      })}
    </Element>
  )
}

export default SplitAnimate
