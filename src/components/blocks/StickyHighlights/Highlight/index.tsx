'use client'

import type { Page } from '@root/payload-types'

import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { CMSLink } from '@components/CMSLink/index'
import Code from '@components/Code/index'
import CodeBlip from '@components/CodeBlip/index'
const CodeBlipProvider = CodeBlip.Provider
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import classes from './index.module.scss'

export type StickyHighlightsProps = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

type Fields = Exclude<StickyHighlightsProps['stickyHighlightsFields'], undefined>

type Props = {
  midBreak: boolean
  yDirection?: 'down' | 'up'
} & Exclude<Fields['highlights'], null | undefined>[number]

export const StickyHighlightComponent: React.FC<Props> = ({
  type,
  code,
  codeBlips,
  enableLink,
  link,
  media,
  midBreak,
  richText,
  yDirection,
}) => {
  const [visible, setVisible] = useState(false)
  const [centerCodeMedia, setCenterCodeMedia] = useState(false)
  const [init, setInit] = useState(false)
  const ref = useRef(null)
  const codeMediaWrapRef = useRef(null)
  const codeMediaInnerRef = useRef(null)
  const nodeRef = useRef(null)
  const { data, isOpen } = CodeBlip.useCodeBlip()

  const codeMediaClasses = [
    classes.codeMedia,
    centerCodeMedia && classes.centerCodeMedia,
    visible && classes.visible,
    'group-active',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!midBreak) {
      const refCopy = ref?.current
      const codeWrapRefCopy = codeMediaWrapRef?.current
      let intersectionObserver: IntersectionObserver
      let resizeObserver: ResizeObserver

      if (refCopy) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setVisible(entry.isIntersecting)
            })
          },
          {
            rootMargin: '0px',
            threshold: 0.5,
          },
        )

        intersectionObserver.observe(refCopy)
      }

      if (codeWrapRefCopy && codeMediaInnerRef?.current) {
        resizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            setCenterCodeMedia(
              // @ts-expect-error
              entry.contentRect.height > (codeMediaInnerRef?.current?.clientHeight || 0),
            )
          })
        })

        resizeObserver.observe(codeWrapRefCopy)
      }

      return () => {
        if (refCopy) {
          intersectionObserver.unobserve(refCopy)
        }

        if (codeWrapRefCopy) {
          resizeObserver.unobserve(codeWrapRefCopy)
        }
      }
    }

    return () => null
  }, [ref, midBreak])

  useEffect(() => {
    setInit(true)
  }, [])

  return (
    <div
      className={[
        classes.stickyHighlight,
        classes[`scroll-direction--${init ? yDirection : 'down'}`],
      ].join(' ')}
      ref={ref}
    >
      <div className={[classes.minHeight, 'grid'].filter(Boolean).join(' ')}>
        <div className={[classes.leftContentWrapper, 'cols-4 cols-m-8'].filter(Boolean).join(' ')}>
          <RichText className={classes.richText} content={richText} />
          {enableLink && (
            <CMSLink
              {...link}
              appearance="default"
              buttonProps={{
                hideHorizontalBorders: true,
                icon: 'arrow',
              }}
              fullWidth
            />
          )}
        </div>
      </div>
      <CSSTransition classNames="animate" in={visible} nodeRef={nodeRef} timeout={750}>
        <Gutter
          className={[classes.codeMediaPosition, 'grid'].filter(Boolean).join(' ')}
          ref={nodeRef}
        >
          {type === 'code' && (
            <Fragment>
              <div
                className={[classes.scanlineWrapper, 'start-9 cols-8'].filter(Boolean).join(' ')}
              >
                <BackgroundScanline
                  className={[classes.scanlineDesktop].filter(Boolean).join(' ')}
                  crosshairs={['top-left', 'bottom-left']}
                />

                <CrosshairIcon className={[classes.crosshairTopRight].filter(Boolean).join(' ')} />

                <CrosshairIcon
                  className={[classes.crosshairBottomRight].filter(Boolean).join(' ')}
                />
              </div>
              <div
                className={[classes.rightContentWrapper, 'cols-10 start-7 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                <BackgroundScanline
                  className={[classes.scanlineMobile, ''].filter(Boolean).join(' ')}
                />
                <div className={codeMediaClasses} ref={codeMediaWrapRef}>
                  <div className={classes.codeMediaInner} ref={codeMediaInnerRef}>
                    <div className={classes.codeWrapper}>
                      <CodeBlip.Modal />
                      <Code
                        className={classes.innerCode}
                        codeBlips={codeBlips}
                        disableMinHeight
                        parentClassName={classes.code}
                      >{`${code}
                          `}</Code>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
          {type === 'media' && typeof media === 'object' && media !== null && (
            <div className={'cols-10 start-7 cols-m-8 start-m-1'}>
              <div className={codeMediaClasses} ref={codeMediaWrapRef}>
                <div className={classes.mediaInner} ref={codeMediaInnerRef}>
                  <div className={classes.media}>
                    <Media resource={media} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Gutter>
      </CSSTransition>
    </div>
  )
}

export const StickyHighlight: React.FC<Props> = React.memo((props) => {
  return (
    <CodeBlipProvider>
      <StickyHighlightComponent {...props} />
    </CodeBlipProvider>
  )
})
