'use client'

import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSForm } from '@components/CMSForm/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

export type FormBlockProps = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'form' }>

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const { formFields: { form, richText, settings } = {}, hideBackground, padding } = props
  const [imageLoaded, setImageLoaded] = useState(false)

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [outerBackgroundStyle, setOuterBackgroundStyle] = useState({})

  useEffect(() => {
    const updateOuterBackgroundWidth = () => {
      const newOuterBackgroundWidth = sectionRef.current ? sectionRef.current.offsetWidth : 0

      const largeScreenMatch = window.matchMedia('(min-width: 2390px)')

      if (largeScreenMatch.matches) {
        setOuterBackgroundStyle({
          width: 'var(--gutter-h)',
        })
      } else {
        setOuterBackgroundStyle({
          width: `${newOuterBackgroundWidth}px`,
        })
      }
    }

    updateOuterBackgroundWidth()
    window.addEventListener('resize', updateOuterBackgroundWidth)

    return () => window.removeEventListener('resize', updateOuterBackgroundWidth)
  }, [])

  if (typeof form === 'string') {
    return null
  }

  return (
    <BlockWrapper
      className={classes.formBlock}
      data-theme="dark"
      hideBackground={hideBackground}
      padding={{ bottom: 'large', top: 'large' }}
      settings={settings}
    >
      <BackgroundGrid zIndex={0} />
      <div
        className={classes.gradientWrap}
        style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}
      >
        <div className={classes.leftGradientOverlay} />
        <div className={classes.rightGradientOverlay} />
      </div>
      <div
        className={[classes.backgroundSectionWrap, 'cols-12 start-5 cols-m-8 start-m-1']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.section} ref={sectionRef}>
          <Image
            alt="Stripe Overlay"
            fill
            onLoad={() => setImageLoaded(true)}
            src="/images/stripe-overlay.png"
          />
        </div>
        <div className={classes.section}>
          <Image
            alt="Stripe Overlay"
            fill
            onLoad={() => setImageLoaded(true)}
            src="/images/stripe-overlay.png"
          />
        </div>
        <div className={classes.section}>
          <Image
            alt="Stripe Overlay"
            fill
            onLoad={() => setImageLoaded(true)}
            src="/images/stripe-overlay.png"
          />
        </div>
      </div>
      <Gutter className={classes.gutter}>
        <div className={[classes.formBlockGrid, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.richTextCell, 'cols-4 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {richText && <RichText content={richText} />}
          </div>
          <div
            className={[classes.formCell, 'cols-8 start-9 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <CMSForm form={form} />
          </div>
        </div>
      </Gutter>
      <div className={classes.outerBackgroundSectionWrap}>
        <div className={classes.outerBackgroundSection} style={outerBackgroundStyle}>
          <Image
            alt="Stripe Overlay"
            fill
            onLoad={() => setImageLoaded(true)}
            src="/images/stripe-overlay.png"
          />
        </div>
      </div>
    </BlockWrapper>
  )
}
