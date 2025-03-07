'use client'
import type { AllowedElements } from '@components/SpotlightAnimation/types'

import { cubicBezier, motion, stagger, useAnimate, useInView } from 'framer-motion'
import React, { useMemo } from 'react'

import classes from './index.module.scss'

interface Props {
  as?: AllowedElements
  callback?: () => void
  className?: string
  text: string
}
const SplitAnimate: React.FC<Props> = ({
  as: Element = 'span',
  callback,
  className,
  text,
  ...props
}) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  const easing = cubicBezier(0.165, 0.84, 0.44, 1)

  const textArray = useMemo(() => {
    if (text === '') {
      return []
    }
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
        { rotate: 0, y: '0%' },
        { delay: stagger(0.075), duration: 1.125, ease: easing },
      ).then(() => {
        if (callback) {
          callback()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, callback])

  return (
    // @ts-expect-error
    <Element className={(classes.element, className)} ref={scope} {...props}>
      {textArray.map((text, index) => {
        const isLast = index + 1 === textArray.length
        return (
          <span className={[classes.word, 'word'].filter(Boolean).join(' ')} key={index}>
            <motion.span
              className={[classes.innerWord, 'inner-word'].filter(Boolean).join(' ')}
              initial={{ rotate: 10, y: '150%' }}
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
