'use client'

import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import Code from '@components/Code/index'
import CodeBlip from '@components/CodeBlip/index'
const CodeBlipProvider = CodeBlip.Provider

import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import SplitAnimate from '@components/SplitAnimate/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import React, { useEffect, useId, useRef, useState } from 'react'

import classes from './index.module.scss'

type Props = {
  className?: string
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'codeFeature' }>

export const CodeFeatureComponent: React.FC<Props> = ({
  className,
  codeFeatureFields,
  hideBackground,
  padding,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0', width: '0' })
  const [tabWrapperWidth, setTabWrapperWidth] = useState(0)
  const tabWrapperRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const { alignment, codeTabs, heading, links, richText, settings } = codeFeatureFields
  const hasLinks = Boolean(links?.length && links.length > 0)
  const id = useId()
  const { data, isOpen } = CodeBlip.useCodeBlip()

  const tabsWrapperRef = useRef<HTMLDivElement | null>(null)
  const [backgroundHeight, setBackgroundHeight] = useState(0)

  useEffect(() => {
    let observer
    const ref = tabWrapperRef.current

    if (ref) {
      observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const {
            contentBoxSize,
            contentRect, // for Safari iOS compatibility, will be deprecated eventually (see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect)
          } = entry

          let newWidth = 0

          if (contentBoxSize) {
            const newSize = Array.isArray(contentBoxSize) ? contentBoxSize[0] : contentBoxSize

            if (newSize) {
              const { inlineSize } = newSize
              newWidth = inlineSize
            }
          } else if (contentRect) {
            // see note above for why this block is needed
            const { width } = contentRect
            newWidth = width
          }

          setTabWrapperWidth(newWidth)
        })
      })

      observer.observe(ref)
    }

    return () => {
      if (observer) {
        observer.unobserve(ref)
      }
    }
  }, [tabWrapperRef])

  useEffect(() => {
    if (activeTabRef.current) {
      setIndicatorStyle({
        left: `${activeTabRef.current.offsetLeft}px`,
        width: `${activeTabRef.current.clientWidth}px`,
      })
    }
  }, [activeIndex, tabWrapperWidth])

  useEffect(() => {
    // Scroll logic has to sit in a separate useEffect because the setIndicatorStyle state change blocks the smooth scroll
    if (activeTabRef.current) {
      tabWrapperRef.current?.scroll(activeTabRef.current.offsetLeft - 20, 0)
    }
  }, [activeIndex])

  useEffect(() => {
    const updateBackgroundHeight = () => {
      const newVideoHeight = tabsWrapperRef.current ? tabsWrapperRef.current.offsetHeight : 0
      setBackgroundHeight(newVideoHeight)
    }
    updateBackgroundHeight()
    window.addEventListener('resize', updateBackgroundHeight)

    return () => window.removeEventListener('resize', updateBackgroundHeight)
  }, [])

  return (
    <BlockWrapper
      className={[classes.wrapper, className].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      id={id}
      padding={padding}
      settings={settings}
    >
      <BackgroundGrid className={classes.backgroundGrid} zIndex={0} />
      <Gutter>
        {alignment === 'codeContent' ? (
          <div
            className={[classes.container, hasLinks && classes.hasLinks, 'grid']
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className={[
                classes.scanlineWrapper,
                alignment === 'codeContent' ? classes.scanlineWrapperLeft : '',
                'start-1 cols-8 start-m-1 cols-m-8',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ height: `calc(${backgroundHeight}px + 10rem)` }}
            >
              <BackgroundScanline
                className={[classes.scanlineDesktopLeft].filter(Boolean).join(' ')}
                crosshairs={['top-right', 'bottom-right']}
              />

              <CrosshairIcon className={[classes.crosshairTopLeft].filter(Boolean).join(' ')} />

              <CrosshairIcon className={[classes.crosshairBottomLeft].filter(Boolean).join(' ')} />
            </div>
            <div
              className={[classes.content, 'start-13 cols-4 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {heading && (
                <h2 className={classes.heading}>
                  <SplitAnimate text={heading} />
                </h2>
              )}
              <div>
                <RichText className={classes.richText} content={richText} />
                <div className={classes.links}>
                  {links?.map((link, index) => {
                    return (
                      <CMSLink
                        appearance={'default'}
                        buttonProps={{
                          appearance: 'default',
                          hideBottomBorderExceptLast: true,
                          hideHorizontalBorders: true,
                        }}
                        key={index}
                        {...link.link}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div
              className={[classes.tabsWrapper, 'cols-10 start-1 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
              ref={tabsWrapperRef}
            >
              <BackgroundScanline
                className={[classes.scanlineMobile, ''].filter(Boolean).join(' ')}
              />
              <CodeBlip.Modal />
              <div
                className={[
                  classes.tabs,
                  codeTabs?.length && codeTabs.length > 1 && classes.hasMultiple,
                ]
                  .filter(Boolean)
                  .join(' ')}
                ref={tabWrapperRef}
                {...(isOpen ? { inert: true } : {})}
              >
                {codeTabs?.length && codeTabs.length > 1 ? (
                  codeTabs?.map((code, index) => {
                    const isActive = activeIndex === index
                    return (
                      <button
                        aria-controls={`codefeature${id}-code-${index}`}
                        aria-pressed={activeIndex === index}
                        className={[classes.tab, activeIndex === index && classes.isActive]
                          .filter(Boolean)
                          .join(' ')}
                        id={`codefeature${id}-tab-${index}`}
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        {...(isActive ? { ref: activeTabRef } : {})}
                      >
                        {code?.label}
                      </button>
                    )
                  })
                ) : (
                  <div className={classes.hiddenTab} id={`codefeature${id}-tab-0`}>
                    {codeTabs?.[0]?.label}
                  </div>
                )}
                <div aria-hidden={true} className={classes.tabIndicator} style={indicatorStyle} />
              </div>
              <div className={classes.codeBlockWrapper} {...(isOpen ? { inert: true } : {})}>
                {codeTabs?.map((code, index) => {
                  return (
                    <div
                      aria-describedby={`codefeature${id}-tab-${index}`}
                      aria-hidden={activeIndex !== index}
                      className={[
                        classes.codeBlock,
                        activeIndex === index && classes.isActive,
                        activeIndex === index && 'group-active',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      id={`codefeature${id}-code-${index}`}
                      // types have not been updated yet for the inert attribute
                      // @ts-expect-error
                      inert={activeIndex !== index ? '' : undefined}
                      key={index}
                    >
                      <Code
                        className={classes.code}
                        codeBlips={code.codeBlips}
                        parentClassName={classes.parentCodeWrapper}
                      >{`${code.code}
                  `}</Code>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={[classes.container, hasLinks && classes.hasLinks, 'grid']
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className={[classes.content, 'start-1 cols-4 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {heading && (
                <h2 className={classes.heading}>
                  <SplitAnimate text={heading} />
                </h2>
              )}
              <div>
                <RichText className={classes.richText} content={richText} />
                <div className={classes.links}>
                  {links?.map((link, index) => {
                    return (
                      <CMSLink
                        appearance={'default'}
                        buttonProps={{
                          appearance: 'default',
                          hideBottomBorderExceptLast: true,
                          hideHorizontalBorders: true,
                        }}
                        key={index}
                        {...link.link}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div
              className={[classes.scanlineWrapper, 'start-9 cols-8 start-m-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
              style={{ height: `calc(${backgroundHeight}px + 10rem)` }}
            >
              <BackgroundScanline
                className={[classes.scanlineDesktopRight].filter(Boolean).join(' ')}
                crosshairs={['top-left', 'bottom-left']}
              />

              <CrosshairIcon className={[classes.crosshairTopRight].filter(Boolean).join(' ')} />

              <CrosshairIcon className={[classes.crosshairBottomRight].filter(Boolean).join(' ')} />
            </div>
            <div
              className={[classes.tabsWrapper, 'cols-10 start-7 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
              ref={tabsWrapperRef}
            >
              <BackgroundScanline
                className={[classes.scanlineMobile, ''].filter(Boolean).join(' ')}
              />
              <CodeBlip.Modal />
              <div
                className={[
                  classes.tabs,
                  codeTabs?.length && codeTabs.length > 1 && classes.hasMultiple,
                ]
                  .filter(Boolean)
                  .join(' ')}
                ref={tabWrapperRef}
                {...(isOpen ? { inert: true } : {})}
              >
                {codeTabs?.length && codeTabs.length > 1 ? (
                  codeTabs?.map((code, index) => {
                    const isActive = activeIndex === index
                    return (
                      <button
                        aria-controls={`codefeature${id}-code-${index}`}
                        aria-pressed={activeIndex === index}
                        className={[classes.tab, activeIndex === index && classes.isActive]
                          .filter(Boolean)
                          .join(' ')}
                        id={`codefeature${id}-tab-${index}`}
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        {...(isActive ? { ref: activeTabRef } : {})}
                      >
                        {code?.label}
                      </button>
                    )
                  })
                ) : (
                  <div className={classes.hiddenTab} id={`codefeature${id}-tab-0`}>
                    {codeTabs?.[0]?.label}
                  </div>
                )}
                <div aria-hidden={true} className={classes.tabIndicator} style={indicatorStyle} />
              </div>
              <div className={classes.codeBlockWrapper} {...(isOpen ? { inert: true } : {})}>
                {codeTabs?.map((code, index) => {
                  return (
                    <div
                      aria-describedby={`codefeature${id}-tab-${index}`}
                      aria-hidden={activeIndex !== index}
                      className={[
                        classes.codeBlock,
                        activeIndex === index && classes.isActive,
                        activeIndex === index && 'group-active',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      id={`codefeature${id}-code-${index}`}
                      // types have not been updated yet for the inert attribute
                      // @ts-expect-error
                      inert={activeIndex !== index ? '' : undefined}
                      key={index}
                    >
                      <Code
                        className={classes.code}
                        codeBlips={code.codeBlips}
                        parentClassName={classes.parentCodeWrapper}
                      >{`${code.code}
                  `}</Code>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

export const CodeFeature: React.FC<Props> = (props) => (
  <CodeBlipProvider>
    <CodeFeatureComponent {...props} />
  </CodeBlipProvider>
)
