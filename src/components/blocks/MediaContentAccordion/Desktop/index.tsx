'use client'
import type { Page } from '@root/payload-types'

import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { CMSLink } from '@components/CMSLink/index'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import SplitAnimate from '@components/SplitAnimate/index'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleToggler,
} from '@faceless-ui/collapsibles'
import { ArrowRightIcon } from '@root/icons/ArrowRightIcon/index'
import { ChevronDownIcon } from '@root/icons/ChevronDownIcon/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import Image from 'next/image'
import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

export type MediaContentAccordionProps = {
  className?: string
} & Extract<Page['layout'][0], { blockType: 'mediaContentAccordion' }>

export const DesktopMediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  className,
  mediaContentAccordionFields,
}) => {
  const { accordion, alignment, heading, leader } = mediaContentAccordionFields || {}

  const mediaRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([])
  const [containerHeight, setContainerHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const hasAccordion = Array.isArray(accordion) && accordion.length > 0
  const [activeAccordion, setActiveAccordion] = useState<number>(0)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(index)
  }

  if (accordion && accordion.length > 0 && mediaRefs.current.length !== accordion.length) {
    mediaRefs.current = accordion.map((_, i) => mediaRefs.current[i] || createRef())
  }

  useEffect(() => {
    const updateContainerHeight = () => {
      const activeMediaRef = mediaRefs.current[activeAccordion]
      if (activeMediaRef && activeMediaRef.current) {
        const activeMediaHeight = activeMediaRef.current.offsetHeight
        setContainerHeight(activeMediaHeight)
      }
    }

    const updateContentWidth = () => {
      const newContentWidth = contentRef.current ? contentRef.current.offsetWidth : 0
      setContentWidth(newContentWidth)
    }

    updateContainerHeight()
    updateContentWidth()

    const resizeObserver = new ResizeObserver((entries) => {
      updateContainerHeight()
      updateContentWidth()
    })

    const activeMediaRef = mediaRefs.current[activeAccordion]
    if (activeMediaRef && activeMediaRef.current) {
      resizeObserver.observe(activeMediaRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [activeAccordion])

  const rightPositionClassMap = {
    inset: 'start-10 cols-6 start-m-1 cols-m-8',
    normal: 'start-9 cols-8 start-m-1 cols-m-8',
    wide: 'start-7 cols-12 start-m-1 cols-m-8',
  }

  const leftPositionClassMap = {
    inset: 'start-2 cols-6 start-m-1 cols-m-8',
    normal: 'start-1 cols-8 start-m-1 cols-m-8',
    wide: 'start-1 cols-12 start-m-1 cols-m-8',
  }

  return (
    <div
      className={[classes.desktopAccordionWrapper, 'grid', className && className]
        .filter(Boolean)
        .join(' ')}
    >
      {alignment === 'mediaContent' ? (
        <Fragment>
          {hasAccordion &&
            accordion.map((item, index) => (
              <Fragment key={item.id || index}>
                {index === activeAccordion && (
                  <>
                    {item.background === 'gradient' && (
                      <div
                        className={[
                          classes.gradientDesktopWrapper,
                          'start-1 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <Image
                          alt=""
                          className={classes.gradientBg}
                          height={946}
                          src={`/images/gradients/1.jpg`}
                          width={1920}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </div>
                    )}
                    {item.background === 'scanlines' && (
                      <div
                        className={[
                          classes.scanlineDesktopWrapper,
                          'start-1 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <BackgroundScanline
                          className={[classes.scanlineDesktop].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </div>
                    )}
                    {item.background === 'none' && (
                      <div
                        className={[
                          classes.transparentDesktopWrapper,
                          'start-1 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <div className={classes.transparentBg} />
                      </div>
                    )}
                  </>
                )}
                <div
                  className={[
                    classes.mediaDesktopContainer,
                    leftPositionClassMap[item.position as keyof typeof leftPositionClassMap],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  ref={mediaRefs.current[index]}
                  style={{
                    left: item.position === 'wide' ? `calc(-1 * ${contentWidth}px / 2)` : '0px',
                    opacity: index === activeAccordion ? 1 : 0,
                    width: '100%',
                  }}
                >
                  {typeof item.media === 'object' && item.media !== null && (
                    <Media resource={item.media} />
                  )}
                </div>
              </Fragment>
            ))}
          <div className={['cols-4 start-13 cols-m-8'].filter(Boolean).join(' ')} ref={contentRef}>
            <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
              {leader && <div className={classes.leader}>{leader}</div>}
              {heading && (
                <h3 className={classes.heading}>
                  <SplitAnimate text={heading} />
                </h3>
              )}
            </div>
            <div>
              <CollapsibleGroup allowMultiple={false} transCurve="ease-in-out" transTime={500}>
                {hasAccordion &&
                  accordion.map((item, index) => (
                    <div
                      className={[
                        classes.collapsibleWrapper,
                        activeAccordion === index ? classes.activeLeftBorder : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={item.id || index}
                    >
                      <Collapsible
                        onToggle={() => toggleAccordion(index)}
                        open={activeAccordion === index}
                      >
                        <CollapsibleToggler
                          className={[
                            classes.collapsibleToggler,
                            activeAccordion === index ? classes.activeItem : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => toggleAccordion(index)}
                        >
                          <div className={classes.togglerTitle}>{item.mediaLabel}</div>
                          <ChevronDownIcon
                            className={[
                              classes.chevronDownIcon,
                              activeAccordion === index ? classes.rotateChevron : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </CollapsibleToggler>
                        <CollapsibleContent className={classes.collapsibleContent}>
                          <div className={classes.contentWrapper}>
                            <RichText
                              className={classes.mediaDescription}
                              content={item.mediaDescription}
                            />
                            {item.enableLink && item.link && (
                              <CMSLink className={classes.link} {...item.link}>
                                <ArrowRightIcon className={classes.arrowIcon} />
                              </CMSLink>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
              </CollapsibleGroup>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={['cols-4 start-1 cols-m-8'].filter(Boolean).join(' ')} ref={contentRef}>
            <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
              {leader && <div className={classes.leader}>{leader}</div>}
              {heading && (
                <h3 className={classes.heading}>
                  <SplitAnimate text={heading} />
                </h3>
              )}
            </div>
            <div>
              <CollapsibleGroup allowMultiple={false} transCurve="ease-in-out" transTime={500}>
                {hasAccordion &&
                  accordion.map((item, index) => (
                    <div
                      className={[
                        classes.collapsibleWrapper,
                        activeAccordion === index ? classes.activeLeftBorder : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={item.id || index}
                    >
                      <Collapsible
                        onToggle={() => toggleAccordion(index)}
                        open={activeAccordion === index}
                      >
                        <CollapsibleToggler
                          className={[
                            classes.collapsibleToggler,
                            activeAccordion === index ? classes.activeItem : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => toggleAccordion(index)}
                        >
                          <div className={classes.togglerTitle}>{item.mediaLabel}</div>
                          <ChevronDownIcon
                            className={[
                              classes.chevronDownIcon,
                              activeAccordion === index ? classes.rotateChevron : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </CollapsibleToggler>
                        <CollapsibleContent className={classes.collapsibleContent}>
                          <div className={classes.contentWrapper}>
                            <RichText
                              className={classes.mediaDescription}
                              content={item.mediaDescription}
                            />
                            {item.enableLink && item.link && (
                              <CMSLink className={classes.link} {...item.link}>
                                <ArrowRightIcon className={classes.arrowIcon} />
                              </CMSLink>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
              </CollapsibleGroup>
            </div>
          </div>
          {hasAccordion &&
            accordion.map((item, index) => (
              <Fragment key={item.id || index}>
                {index === activeAccordion && (
                  <>
                    {item.background === 'gradient' && (
                      <div
                        className={[
                          classes.gradientDesktopWrapper,
                          'start-9 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <Image
                          alt=""
                          className={classes.gradientBg}
                          height={946}
                          src={`/images/gradients/1.jpg`}
                          width={1920}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </div>
                    )}
                    {item.background === 'scanlines' && (
                      <div
                        className={[
                          classes.scanlineDesktopWrapper,
                          'start-9 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <BackgroundScanline
                          className={[classes.scanlineDesktop].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </div>
                    )}
                    {item.background === 'none' && (
                      <div
                        className={[
                          classes.transparentDesktopWrapper,
                          'start-9 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <div className={classes.transparentBg} />
                      </div>
                    )}
                  </>
                )}
                <div
                  className={[
                    classes.mediaDesktopContainer,
                    rightPositionClassMap[item.position as keyof typeof rightPositionClassMap],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  ref={mediaRefs.current[index]}
                  style={{
                    opacity: index === activeAccordion ? 1 : 0,
                    width: item.position === 'wide' ? `calc(100% + ${contentWidth}px / 2)` : '100%',
                  }}
                >
                  {typeof item.media === 'object' && item.media !== null && (
                    <Media resource={item.media} />
                  )}
                </div>
              </Fragment>
            ))}
        </Fragment>
      )}
    </div>
  )
}
