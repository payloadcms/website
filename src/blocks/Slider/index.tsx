import * as React from 'react'
import { Slide, SliderNav, SliderProvider, SliderTrack } from '@faceless-ui/slider'

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

type Props = Extract<Page['layout'][0], { blockType: 'slider' }>

export const SliderBlock: React.FC<Props> = ({ sliderFields }) => {
  const { sliderType, useLeadingHeader, leadingHeader } = sliderFields

  const slides = sliderType === 'imageSlider' ? sliderFields.imageSlides : sliderFields.quoteSlides

  if (!slides || slides.length === 0) return null

  const CardToRender = cardTypes[sliderType]
  const withPixelBackground = sliderType === 'quoteSlider'

  return (
    <div
      className={[classes.slider, withPixelBackground && classes.withPixelBackground]
        .filter(Boolean)
        .join(' ')}
    >
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

      {withPixelBackground && (
        <Gutter className={classes.pixelContainer}>
          <div className={['grid'].filter(Boolean).join(' ')}>
            <div className={[classes.pixelCell, 'cols-9 start-4'].filter(Boolean).join(' ')}>
              <PixelBackground />
            </div>
          </div>
        </Gutter>
      )}
    </div>
  )
}

export const Slider: React.FC<Props> = props => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider slidesToShow={1.5} scrollOffset={gutterH}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}
