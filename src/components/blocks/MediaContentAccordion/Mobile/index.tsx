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

export const MobileMediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  className,
  mediaContentAccordionFields,
}) => {
  const { accordion, heading, leader } = mediaContentAccordionFields || {}

  const mediaRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([])
  const [containerHeight, setContainerHeight] = useState(0)
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

    updateContainerHeight()

    const resizeObserver = new ResizeObserver((entries) => {
      updateContainerHeight()
    })

    const activeMediaRef = mediaRefs.current[activeAccordion]
    if (activeMediaRef && activeMediaRef.current) {
      resizeObserver.observe(activeMediaRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [activeAccordion])

  return (
    <div
      className={[classes.mobileAccordionWrapper, className && className].filter(Boolean).join(' ')}
    >
      <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
        {leader && <div className={classes.leader}>{leader}</div>}
        {heading && (
          <h3 className={classes.heading}>
            <SplitAnimate text={heading} />
          </h3>
        )}
      </div>
      <div
        className={classes.mediaBackgroundWrapper}
        style={{ height: `calc(${containerHeight}px + 6rem)` }}
      >
        {hasAccordion &&
          accordion.map((item, index) => (
            <Fragment key={item.id || index}>
              {index === activeAccordion && (
                <>
                  {item.background === 'gradient' && (
                    <Fragment>
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
                    </Fragment>
                  )}
                  {item.background === 'scanlines' && (
                    <Fragment>
                      <BackgroundScanline
                        className={[classes.scanlineMobile].filter(Boolean).join(' ')}
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
                    </Fragment>
                  )}
                  {item.background === 'none' && <div className={classes.transparentBg} />}
                </>
              )}
            </Fragment>
          ))}
        <div className={classes.mediaMobileContainer}>
          {hasAccordion &&
            accordion.map((item, index) => (
              <div
                className={classes.media}
                key={item.id || index}
                ref={mediaRefs.current[index]}
                style={{ opacity: index === activeAccordion ? 1 : 0 }}
              >
                {typeof item.media === 'object' && item.media !== null && (
                  <Media resource={item.media} />
                )}
              </div>
            ))}
        </div>
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
  )
}
