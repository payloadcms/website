import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import Code from '@components/Code'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'codeFeature' }>

export const CodeFeature: React.FC<Props> = ({ codeFeatureFields }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: '0', left: '0' })
  const tabWrapperRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const { heading, richText, forceDarkBackground, codeTabs, links } = codeFeatureFields
  const id = useId()

  useEffect(() => {
    if (activeTabRef.current) {
      setIndicatorStyle({
        width: `${activeTabRef.current.clientWidth}px`,
        left: `${activeTabRef.current.offsetLeft}px`,
      })
      tabWrapperRef.current?.scroll(activeTabRef.current.offsetLeft - 20, 0)
    }
  }, [activeIndex])

  return (
    <div
      className={[classes.wrapper, forceDarkBackground && classes.darkTheme]
        .filter(Boolean)
        .join(' ')}
      {...(forceDarkBackground ? { 'data-theme': 'dark' } : {})}
      id={id}
    >
      <Gutter>
        <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
          <BackgroundGrid ignoreGutter className={classes.backgroundGrid} />
          <div className={[classes.content, 'cols-4 cols-m-8'].filter(Boolean).join(' ')}>
            <h2 className={classes.heading}>{heading}</h2>
            {forceDarkBackground}
            <div className={[''].filter(Boolean).join(' ')}>
              <div className={''}>
                <RichText content={richText} className={classes.richText} />

                <div className={classes.links}>
                  {links?.map((link, index) => {
                    return <CMSLink key={index} {...link} />
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            className={[classes.tabsWrapper, 'cols-10 start-7 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={classes.tabs} ref={tabWrapperRef}>
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
                      {code.label}
                    </button>
                  )
                })
              ) : (
                <div className={classes.hiddenTab} id={`codefeature${id}-tab-0`}>
                  {codeTabs?.[0].label}
                </div>
              )}
              <div className={classes.tabIndicator} style={indicatorStyle} aria-hidden={true} />
            </div>
            {codeTabs?.map((code, index) => {
              return (
                <div
                  key={index}
                  className={[classes.codeBlock, activeIndex === index && classes.isActive]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={activeIndex !== index}
                  aria-describedby={`codefeature${id}-tab-${index}`}
                  id={`codefeature${id}-code-${index}`}
                >
                  <Code>{`${code.code}
                  `}</Code>
                </div>
              )
            })}
          </div>
        </div>
      </Gutter>
    </div>
  )
}
