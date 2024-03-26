import React, { useEffect, useId, useRef, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import Code from '@components/Code'
import CodeBlip from '@components/CodeBlip'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import SplitAnimate from '@components/SplitAnimate'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'codeFeature' }> & {
  className?: string
  padding: PaddingProps
}

export const CodeFeatureComponent: React.FC<Props> = ({
  codeFeatureFields,
  className,
  padding,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: '0', left: '0' })
  const [tabWrapperWidth, setTabWrapperWidth] = useState(0)
  const tabWrapperRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const { alignment, heading, richText, codeTabs, links, settings } = codeFeatureFields
  const hasLinks = Boolean(links?.length && links.length > 0)
  const id = useId()
  const { data, isOpen } = CodeBlip.useCodeBlip()

  const tabsWrapperRef = useRef<HTMLDivElement | null>(null)
  const [backgroundHeight, setBackgroundHeight] = useState(0)

  useEffect(() => {
    let observer
    let ref = tabWrapperRef.current

    if (ref) {
      observer = new ResizeObserver(entries => {
        entries.forEach(entry => {
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
        width: `${activeTabRef.current.clientWidth}px`,
        left: `${activeTabRef.current.offsetLeft}px`,
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
      settings={settings}
      padding={padding}
      className={[classes.wrapper, className].filter(Boolean).join(' ')}
      id={id}
    >
      <BackgroundGrid zIndex={0} className={classes.backgroundGrid} />
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
                <RichText content={richText} className={classes.richText} />
                <div className={classes.links}>
                  {links?.map((link, index) => {
                    return (
                      <CMSLink
                        key={index}
                        appearance={'default'}
                        buttonProps={{
                          appearance: 'default',
                          hideHorizontalBorders: true,
                          hideBottomBorderExceptLast: true,
                        }}
                        {...link.link}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div
              ref={tabsWrapperRef}
              className={[classes.tabsWrapper, 'cols-10 start-1 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
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
                {...(isOpen ? { inert: '' } : {})}
              >
                {codeTabs?.length && codeTabs.length > 1 ? (
                  codeTabs?.map((code, index) => {
                    const isActive = activeIndex === index
                    return (
                      <button
                        key={index}
                        className={[classes.tab, activeIndex === index && classes.isActive]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={activeIndex === index}
                        id={`codefeature${id}-tab-${index}`}
                        aria-controls={`codefeature${id}-code-${index}`}
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
                <div className={classes.tabIndicator} style={indicatorStyle} aria-hidden={true} />
              </div>
              <div className={classes.codeBlockWrapper} {...(isOpen ? { inert: '' } : {})}>
                {codeTabs?.map((code, index) => {
                  return (
                    <div
                      key={index}
                      className={[
                        classes.codeBlock,
                        activeIndex === index && classes.isActive,
                        activeIndex === index && 'group-active',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden={activeIndex !== index}
                      aria-describedby={`codefeature${id}-tab-${index}`}
                      id={`codefeature${id}-code-${index}`}
                      // types have not been updated yet for the inert attribute
                      // @ts-expect-error
                      inert={activeIndex !== index ? '' : undefined}
                    >
                      <Code
                        parentClassName={classes.parentCodeWrapper}
                        className={classes.code}
                        codeBlips={code.codeBlips}
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
                <RichText content={richText} className={classes.richText} />
                <div className={classes.links}>
                  {links?.map((link, index) => {
                    return (
                      <CMSLink
                        key={index}
                        appearance={'default'}
                        buttonProps={{
                          appearance: 'default',
                          hideHorizontalBorders: true,
                          hideBottomBorderExceptLast: true,
                        }}
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
              ref={tabsWrapperRef}
              className={[classes.tabsWrapper, 'cols-10 start-7 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
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
                {...(isOpen ? { inert: '' } : {})}
              >
                {codeTabs?.length && codeTabs.length > 1 ? (
                  codeTabs?.map((code, index) => {
                    const isActive = activeIndex === index
                    return (
                      <button
                        key={index}
                        className={[classes.tab, activeIndex === index && classes.isActive]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={activeIndex === index}
                        id={`codefeature${id}-tab-${index}`}
                        aria-controls={`codefeature${id}-code-${index}`}
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
                <div className={classes.tabIndicator} style={indicatorStyle} aria-hidden={true} />
              </div>
              <div className={classes.codeBlockWrapper} {...(isOpen ? { inert: '' } : {})}>
                {codeTabs?.map((code, index) => {
                  return (
                    <div
                      key={index}
                      className={[
                        classes.codeBlock,
                        activeIndex === index && classes.isActive,
                        activeIndex === index && 'group-active',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden={activeIndex !== index}
                      aria-describedby={`codefeature${id}-tab-${index}`}
                      id={`codefeature${id}-code-${index}`}
                      // types have not been updated yet for the inert attribute
                      // @ts-expect-error
                      inert={activeIndex !== index ? '' : undefined}
                    >
                      <Code
                        parentClassName={classes.parentCodeWrapper}
                        className={classes.code}
                        codeBlips={code.codeBlips}
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

export const CodeFeature: React.FC<Props> = props => (
  <CodeBlip.Provider>
    <CodeFeatureComponent {...props} />
  </CodeBlip.Provider>
)
