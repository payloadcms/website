'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSForm } from '@components/CMSForm'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type FormBlockProps = Extract<Page['layout'][0], { blockType: 'form' }> & {
  padding: PaddingProps
}

export const FormBlock: React.FC<FormBlockProps> = props => {
  const { formFields: { richText, form, settings } = {}, padding } = props

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [sectionWidth, setSectionWidth] = useState(0)

  useEffect(() => {
    const updateOuterBackgroundWidth = () => {
      const newOuterBackgroundWidth = sectionRef.current ? sectionRef.current.offsetWidth : 0
      setSectionWidth(newOuterBackgroundWidth)
    }
    updateOuterBackgroundWidth()
    window.addEventListener('resize', updateOuterBackgroundWidth)

    return () => window.removeEventListener('resize', updateOuterBackgroundWidth)
  }, [])

  if (typeof form === 'string') return null

  return (
    <BlockWrapper settings={settings} padding={padding} className={classes.formBlock}>
      <BackgroundGrid zIndex={0} />
      <div className={classes.gradientWrap}>
        <div className={classes.leftGradientOverlay} />
        <div className={classes.rightGradientOverlay} />
      </div>
      <div
        className={[classes.backgroundSectionWrap, 'cols-12 start-5 cols-m-8 start-m-1']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.section} ref={sectionRef}>
          <Image src="/images/stripe-overlay.png" fill alt="Stripe Overlay" />
        </div>
        <div className={classes.section}>
          <Image src="/images/stripe-overlay.png" fill alt="Stripe Overlay" />
        </div>
        <div className={classes.section}>
          <Image src="/images/stripe-overlay.png" fill alt="Stripe Overlay" />
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
        <div className={classes.outerBackgroundSection} style={{ width: sectionWidth }}>
          <Image src="/images/stripe-overlay.png" fill alt="Stripe Overlay" />
        </div>
      </div>
    </BlockWrapper>
  )
}
