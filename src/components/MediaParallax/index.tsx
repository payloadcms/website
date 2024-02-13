import React from 'react'
import { motion, transform, useScroll, useTransform } from 'framer-motion'

import { Media } from '@components/Media'
import { Media as MediaType } from '@root/payload-types'

import classes from './index.module.scss'

type ParallaxProps = {
  media: { image: string | MediaType }[]
  className?: string
}

const MediaParallax: React.FC<ParallaxProps> = ({ media, className }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollValue, setScrollValue] = React.useState(0)
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  })

  React.useEffect(() => {
    scrollYProgress.on('change', () => {
      setScrollValue(scrollYProgress.get())
    })

    return () => {
      scrollYProgress.clearListeners()
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={[classes.parallaxMedia, className].filter(Boolean).join(' ')}
    >
      {media?.map((image, index) => {
        const MULTIPLIER = Math.min(1 + index / 5, 2)
        const transformer = transform([0, 1], [-50 * MULTIPLIER, 50 * MULTIPLIER])

        return (
          <motion.div
            key={index}
            className={classes.parallaxItem}
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
                <Media resource={image.image} />
              </>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default MediaParallax
