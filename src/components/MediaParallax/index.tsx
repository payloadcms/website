import type { Props as MediaProps } from '@components/Media/types'
import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
import { motion, transform, useScroll } from 'framer-motion'
import React from 'react'

import classes from './index.module.scss'

type ParallaxProps = {
  className?: string
  media: { image: MediaType | string }[]
} & {
  priority?: MediaProps['priority']
}

const MediaParallax: React.FC<ParallaxProps> = ({ className, media, ...mediaProps }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollValue, setScrollValue] = React.useState(0)
  const { scrollY, scrollYProgress } = useScroll({
    offset: ['end start', 'start end'],
    target: containerRef,
  })

  React.useEffect(() => {
    setScrollValue(scrollYProgress.get())

    scrollYProgress.on('change', () => {
      setScrollValue(scrollYProgress.get())
    })

    return () => {
      scrollYProgress.clearListeners()
    }
  }, [])

  return (
    <motion.div
      className={[classes.parallaxMedia, className].filter(Boolean).join(' ')}
      ref={containerRef}
    >
      {media?.map((image, index) => {
        const MULTIPLIER = Math.min(1 + index / 5, 2)
        const transformer = transform([0, 1], [-50 * MULTIPLIER, 50 * MULTIPLIER])

        return (
          <motion.div
            className={classes.parallaxItem}
            initial={{ ...(index === 0 ? {} : { translateY: -50 * MULTIPLIER }) }}
            key={index}
            style={{
              ...(index === 0
                ? {}
                : {
                    translateY: transformer(scrollValue),
                  }),
            }}
          >
            {typeof image.image !== 'string' && (
              <>
                <Media resource={image.image} {...mediaProps} />
              </>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default MediaParallax
