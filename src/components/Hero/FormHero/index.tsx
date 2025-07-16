'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSForm } from '@components/CMSForm/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import React, { useEffect, useRef, useState } from 'react'

import { useGetHeroPadding } from '../useGetHeroPadding'
import classes from './index.module.scss'

export type FormHeroProps = Page['hero']

export const FormHero: React.FC<
  {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  } & FormHeroProps
> = (props) => {
  const { description, firstContentBlock, form, richText, theme } = props
  const padding = useGetHeroPadding(theme, firstContentBlock)

  const formRef = useRef<HTMLDivElement | null>(null)
  const [backgroundHeight, setBackgroundHeight] = useState(0)

  useEffect(() => {
    const updateBackgroundHeight = () => {
      const newBackgroundHeight = formRef.current ? formRef.current.offsetHeight : 0
      setBackgroundHeight(newBackgroundHeight)
    }
    updateBackgroundHeight()
    window.addEventListener('resize', updateBackgroundHeight)

    return () => window.removeEventListener('resize', updateBackgroundHeight)
  }, [])

  if (typeof form === 'string') {
    return null
  }

  return (
    <BlockWrapper hero padding={padding} settings={{ theme }}>
      <BackgroundGrid zIndex={0} />
      <Gutter>
        <div className={[classes.formHero, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, 'start-1 cols-6 cols-m-8 start-1']
              .filter(Boolean)
              .join(' ')}
          >
            <RichText className={[classes.richText].filter(Boolean).join(' ')} content={richText} />
            <div className={classes.contentWrapper}>
              <RichText
                className={[classes.description].filter(Boolean).join(' ')}
                content={description}
              />
            </div>
          </div>
          <div
            className={[classes.formWrapper, 'cols-8 start-9 cols-m-8 start-m-1 grid']
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className={[classes.scanlineDesktopWrapper, 'cols-16 start-5 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
              style={{ height: `calc(${backgroundHeight}px + 10rem)` }}
            >
              <BackgroundScanline
                className={[classes.scanline].filter(Boolean).join(' ')}
                crosshairs={['top-left', 'bottom-left']}
              />
            </div>
            <div
              className={[classes.scanlineMobileWrapper, 'cols-16 start-5 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
              style={{ height: `calc(${backgroundHeight}px + 4px)` }}
            >
              <BackgroundScanline
                className={[classes.scanline].filter(Boolean).join(' ')}
                crosshairs={['top-left', 'bottom-left']}
              />
            </div>
            <div
              className={[classes.cmsForm, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
              ref={formRef}
            >
              <CMSForm form={form} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
