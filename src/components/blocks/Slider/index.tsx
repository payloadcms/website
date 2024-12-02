import * as React from 'react'
import {
  Slide,
  SliderNav,
  SliderProgress,
  SliderProvider,
  SliderTrack,
  useSlider,
} from '@faceless-ui/slider'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Page } from '@root/payload-types.js'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import { useComputedCSSValues } from '@providers/ComputedCSSValues/index.js'
import { QuoteCard } from './QuoteCard/index.js'

import classes from './index.module.scss'
import RichText from '@components/RichText/index.js'
import { CMSLink } from '@components/CMSLink/index.js'

type Props = Extract<Page['layout'][0], { blockType: 'slider' }> & {
  padding?: PaddingProps
  hideBackground?: boolean
}

export const SliderBlock: React.FC<Props> = ({ sliderFields, padding, hideBackground }) => {
  const { settings, quoteSlides, introContent, links } = sliderFields
  const { currentSlideIndex } = useSlider()

  const slides = quoteSlides

  if (!slides || slides.length === 0) return null

  const isFirst = currentSlideIndex === 0
  const isLast = currentSlideIndex + 2 === slides.length

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
      hideBackground={hideBackground}
      className={[classes.slider].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={0} />

      {introContent && introContent.root.children.length > 0 && (
        <Gutter className={['grid', classes.introContent].filter(Boolean).join(' ')}>
          <div className="cols-12 cols-m-8">
            <RichText content={introContent} />
          </div>
          {links && (
            <div className="cols-4 start-13 cols-m-8 start-m-1">
              {links.map(({ link, id }) => {
                return (
                  <CMSLink
                    {...link}
                    key={id}
                    fullWidth
                    buttonProps={{
                      hideHorizontalBorders: true,
                      hideBottomBorderExceptLast: true,
                    }}
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
                key={index}
                index={index}
                className={[classes.slide, classes.quoteSlide].filter(Boolean).join(' ')}
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
          prevButtonProps={{
            className: [classes.navButton, classes.prevButton, isFirst && classes.disabled]
              .filter(Boolean)
              .join(' '),
            children: <ArrowIcon rotation={225} />,
            disabled: isFirst,
          }}
          nextButtonProps={{
            className: [classes.navButton, isLast && classes.disabled].filter(Boolean).join(' '),
            children: <ArrowIcon rotation={45} />,
            disabled: isLast,
          }}
        />
      </Gutter>
      <SliderProgress />
    </BlockWrapper>
  )
}

export const Slider: React.FC<Props> = props => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider scrollSnap={true} slideOnSelect={true} slidesToShow={1} scrollOffset={gutterH}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}
