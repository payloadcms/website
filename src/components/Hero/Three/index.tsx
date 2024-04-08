'use client'

import React, { useRef } from 'react'
import { cubicBezier, motion, useScroll, useTransform } from 'framer-motion'

import { BackgroundGrid } from '@components/BackgroundGrid'
import BigThree from '@components/BigThree'
import { BlockWrapper } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Gutter } from '@components/Gutter'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { BlocksProp } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const ThreeHero: React.FC<
  Pick<Page['hero'], 'richText' | 'media' | 'buttons' | 'description' | 'theme'> & {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  }
> = ({ richText, buttons, theme, firstContentBlock }) => {
  const padding = useGetHeroPadding(theme, firstContentBlock)
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start 90px', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['translateY(-55%)', 'translateY(-120%)'])

  return (
    <BlockWrapper settings={{ theme }} padding={padding} className={classes.blockWrapper}>
      <BackgroundGrid zIndex={0} />
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
          >
            <RichText content={richText} className={[classes.richText].filter(Boolean).join(' ')} />

            <div className={classes.linksWrapper}>
              {Array.isArray(buttons) &&
                buttons.map((button, i) => {
                  if (button.blockType === 'command') {
                    return (
                      <CreatePayloadApp
                        key={i + button.command}
                        label={button.command}
                        background={false}
                        className={classes.createPayloadApp}
                      />
                    )
                  }
                  if (button.blockType === 'link' && button.link) {
                    return (
                      <CMSLink
                        key={i + button.link.label}
                        {...button.link}
                        className={classes.link}
                        appearance="default"
                        buttonProps={{
                          hideBorders: true,
                        }}
                      />
                    )
                  }
                })}
            </div>
          </div>
          <div className="gradients" />
          <motion.div
            className={classes.graphicWrapper}
            style={{ transform: y, zIndex: 2 }}
            initial={{ opacity: 0, marginTop: '100px' }}
            animate={{ opacity: 1, marginTop: '0px' }}
            transition={{ duration: 2, ease: cubicBezier(0.5, 0, 0, 1) }}
          >
            <BigThree />
          </motion.div>
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}
