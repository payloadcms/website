'use client'
import React, { useMemo } from 'react'
import { cubicBezier, motion, stagger, useAnimate, useInView } from 'framer-motion'

import { AllowedElements } from '@components/SpotlightAnimation/types'

import classes from './index.module.scss'

interface Props {
  text: string
  className?: string
  as?: AllowedElements
  callback?: () => void
}
const SplitAnimate: React.FC<Props> = ({
  text,
  className,
  as: Element = 'span',
  callback,
  ...props
}) => {
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
      ).then(() => {
        if (callback) callback()
      })
    }
  }, [isInView, callback])

  return (
    <Element ref={scope} className={(classes.element, className)} {...props}>
      {textArray.map((text, index) => {
        return (
          <span className={[classes.word, 'word'].filter(Boolean).join(' ')} key={index}>
            <motion.span
              initial={{ y: '150%', rotate: 10 }}
              className={[classes.innerWord, 'inner-word'].filter(Boolean).join(' ')}
            >
              {text}
            </motion.span>
          </span>
        )
      })}
    </Element>
  )
}

export default SplitAnimate
