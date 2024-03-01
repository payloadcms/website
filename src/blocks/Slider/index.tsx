import * as React from 'react'
import { Slide, SliderNav, SliderProvider, SliderTrack } from '@faceless-ui/slider'

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
  const { sliderType, useLeadingHeader, leadingHeader, settings } = sliderFields

  const slides = sliderType === 'imageSlider' ? sliderFields.imageSlides : sliderFields.quoteSlides

  if (!slides || slides.length === 0) return null

  const CardToRender = cardTypes[sliderType]
  const withPixelBackground = sliderType === 'quoteSlider'

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
      className={[classes.slider].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={0} />
      <Gutter>
        {useLeadingHeader && <RichText content={leadingHeader} className={classes.leadingHeader} />}
        <SliderNav
          className={classes.sliderNav}
          prevButtonProps={{
            className: [classes.navButton, classes.prevButton].filter(Boolean).join(' '),
            children: <ArrowIcon rotation={225} />,
          }}
          nextButtonProps={{
            className: classes.navButton,
            children: <ArrowIcon rotation={45} />,
          }}
        />
      </Gutter>

      <div className={classes.trackWrap}>
        <SliderTrack className={classes.sliderTrack}>
          {slides.map((slide, index) => {
            return (
              <Slide
                key={index}
                index={index}
                className={[classes.slide, classes[`slideType--${sliderType}`]]
                  .filter(Boolean)
                  .join(' ')}
              >
                <CardToRender {...slide} />
              </Slide>
            )
          })}
        </SliderTrack>
        <div className={classes.progressBarBackground} />
      </div>
    </BlockWrapper>
  )
}

export const Slider: React.FC<Props> = props => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider slidesToShow={1.25} scrollOffset={gutterH}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}
