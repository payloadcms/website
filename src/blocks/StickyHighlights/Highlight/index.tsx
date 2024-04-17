import React, { Fragment, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { BackgroundScanline } from '@components/BackgroundScanline'
import { CMSLink } from '@components/CMSLink'
import Code from '@components/Code'
import CodeBlip from '@components/CodeBlip'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type StickyHighlightsProps = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

type Fields = Exclude<StickyHighlightsProps['stickyHighlightsFields'], undefined>

type Props = Exclude<Fields['highlights'], undefined | null>[number] & {
  yDirection?: 'up' | 'down'
  midBreak: boolean
}

export const StickyHighlightComponent: React.FC<Props> = ({
  richText,
  enableLink,
  link,
  type,
  code,
  media,
  yDirection,
  midBreak,
  codeBlips,
}) => {
  const [visible, setVisible] = useState(false)
  const [centerCodeMedia, setCenterCodeMedia] = useState(false)
  const [init, setInit] = useState(false)
  const ref = useRef(null)
  const codeMediaWrapRef = useRef(null)
  const codeMediaInnerRef = useRef(null)
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
          entries => {
            entries.forEach(entry => {
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
        resizeObserver = new ResizeObserver(entries => {
          entries.forEach(entry => {
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
      ref={ref}
      className={[
        classes.stickyHighlight,
        classes[`scroll-direction--${init ? yDirection : 'down'}`],
      ].join(' ')}
    >
      <div className={[classes.minHeight, 'grid'].filter(Boolean).join(' ')}>
        <div className={[classes.leftContentWrapper, 'cols-4 cols-m-8'].filter(Boolean).join(' ')}>
          <RichText content={richText} className={classes.richText} />
          {enableLink && (
            <CMSLink
              {...link}
              appearance="default"
              fullWidth
              buttonProps={{
                icon: 'arrow',
                hideHorizontalBorders: true,
              }}
            />
          )}
        </div>
      </div>
      <CSSTransition in={visible} timeout={750} classNames="animate">
        <Gutter className={[classes.codeMediaPosition, 'grid'].filter(Boolean).join(' ')}>
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
                        parentClassName={classes.code}
                        codeBlips={codeBlips}
                        className={classes.innerCode}
                        disableMinHeight
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

export const StickyHighlight: React.FC<Props> = React.memo(props => {
  return (
    <CodeBlip.Provider>
      <StickyHighlightComponent {...props} />
    </CodeBlip.Provider>
  )
})
