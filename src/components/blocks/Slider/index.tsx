import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import {
  Slide,
  SliderNav,
  SliderProgress,
  SliderProvider,
  SliderTrack,
  useSlider,
} from '@faceless-ui/slider'
import { ArrowIcon } from '@icons/ArrowIcon/index'
import { useComputedCSSValues } from '@providers/ComputedCSSValues/index'
import * as React from 'react'

import classes from './index.module.scss'
import { QuoteCard } from './QuoteCard/index'

type Props = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'slider' }>

export const SliderBlock: React.FC<Props> = ({ hideBackground, padding, sliderFields }) => {
  const { introContent, links, quoteSlides, settings } = sliderFields
  const { currentSlideIndex } = useSlider()

  const slides = quoteSlides

  if (!slides || slides.length === 0) {
    return null
  }

  const isFirst = currentSlideIndex === 0
  const isLast = currentSlideIndex + 2 === slides.length

  return (
    <BlockWrapper
      className={[classes.slider].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      padding={padding}
      settings={settings}
    >
      <BackgroundGrid zIndex={0} />

      {introContent && introContent.root.children.length > 0 && (
        <Gutter className={['grid', classes.introContent].filter(Boolean).join(' ')}>
          <div className="cols-12 cols-m-8">
            <RichText content={introContent} />
          </div>
          {links && (
            <div className="cols-4 start-13 cols-m-8 start-m-1">
              {links.map(({ id, link }) => {
                return (
                  <CMSLink
                    {...link}
                    buttonProps={{
                      hideBottomBorderExceptLast: true,
                      hideHorizontalBorders: true,
                    }}
                    fullWidth
                    key={id}
                  />
                )
              })}
            </div>
          )}
        </Gutter>
      )}

      <div className={classes.trackWrap}>
        <SliderTrack className={classes.sliderTrack}>
          {slides.map((slide, index) => {
            const isActive =
              currentSlideIndex === index ? true : currentSlideIndex === index - 1 ? true : false
            return (
              <Slide
                className={[classes.slide, classes.quoteSlide].filter(Boolean).join(' ')}
                index={index}
                key={index}
              >
                <QuoteCard isActive={isActive} {...slide} />
              </Slide>
            )
          })}
        </SliderTrack>
        <div className={classes.progressBarBackground} />
      </div>

      <Gutter>
        <SliderNav
          className={classes.sliderNav}
          nextButtonProps={{
            children: <ArrowIcon rotation={45} />,
            className: [classes.navButton, isLast && classes.disabled].filter(Boolean).join(' '),
            disabled: isLast,
          }}
          prevButtonProps={{
            children: <ArrowIcon rotation={225} />,
            className: [classes.navButton, classes.prevButton, isFirst && classes.disabled]
              .filter(Boolean)
              .join(' '),
            disabled: isFirst,
          }}
        />
      </Gutter>
      <SliderProgress />
    </BlockWrapper>
  )
}

export const Slider: React.FC<Props> = (props) => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider scrollOffset={gutterH} scrollSnap={true} slideOnSelect={true} slidesToShow={1}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}
