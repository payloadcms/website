import * as React from 'react'
import {
  Slide,
  SliderNav,
  SliderProgress,
  SliderProvider,
  SliderTrack,
  useSlider,
} from '@faceless-ui/slider'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'
import { ArrowIcon } from '../../icons/ArrowIcon'
import { useComputedCSSValues } from '../../providers/ComputedCSSValues'
import { ImageCard } from './ImageCard'
import { QuoteCard } from './QuoteCard'

import classes from './index.module.scss'

const cardTypes = {
  imageSlider: ImageCard,
  quoteSlider: QuoteCard,
}

type Props = Extract<Page['layout'][0], { blockType: 'slider' }> & {
  padding?: PaddingProps
}

export const SliderBlock: React.FC<Props> = ({ sliderFields, padding }) => {
  const { sliderType, settings } = sliderFields
  const { currentSlideIndex } = useSlider()

  const slides = sliderType === 'imageSlider' ? sliderFields.imageSlides : sliderFields.quoteSlides

  if (!slides || slides.length === 0) return null

  const CardToRender = cardTypes[sliderType]
  const withPixelBackground = sliderType === 'quoteSlider'

  const isFirst = currentSlideIndex === 0
  const isLast = currentSlideIndex + 1 === slides.length

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
      className={[classes.slider].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={0} />

      <div className={classes.trackWrap}>
        <BackgroundGrid
          zIndex={5}
          ignoreGutter
          gridLineStyles={{
            1: {
              display: 'none',
            },
            2: {
              display: 'none',
            },
            3: {
              display: 'none',
            },
          }}
        />
        <SliderTrack className={classes.sliderTrack}>
          {slides.map((slide, index) => {
            const isActive = currentSlideIndex === index
            return (
              <Slide
                key={index}
                index={index}
                className={[classes.slide, classes[`slideType--${sliderType}`]]
                  .filter(Boolean)
                  .join(' ')}
              >
                <BackgroundGrid
                  zIndex={1}
                  ignoreGutter
                  gridLineStyles={{
                    0: { display: 'none' },
                    1: { display: 'none' },
                    2: { display: 'none' },
                    3: { display: 'none' },
                  }}
                />
                <CardToRender isActive={isActive} {...slide} />
              </Slide>
            )
          })}
          <div className={classes.fakeSlide} />
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
