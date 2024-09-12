'use client'
import React, { useMemo } from 'react'
import { cubicBezier, motion, stagger, useAnimate, useInView } from 'framer-motion'

import { AllowedElements } from '@components/SpotlightAnimation/types.js'

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
    return text
      .trim()
      .replace('-', '‑')
      .replace(/&#8232;/g, ' ') // Replaces figma inserted character, see: https://forum.figma.com/t/creating-new-line-via-shift-enter-adds-a-l-sep-symbol/2856/4
      .split(' ')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, callback])

  return (
    // @ts-expect-error
    <Element ref={scope} className={(classes.element, className)} {...props}>
      {textArray.map((text, index) => {
        const isLast = index + 1 === textArray.length
        return (
          <span className={[classes.word, 'word'].filter(Boolean).join(' ')} key={index}>
            <motion.span
              initial={{ y: '150%', rotate: 10 }}
              className={[classes.innerWord, 'inner-word'].filter(Boolean).join(' ')}
            >
              {isLast ? text : text + ' '}
            </motion.span>
          </span>
        )
      })}
    </Element>
  )
}

export default SplitAnimate
