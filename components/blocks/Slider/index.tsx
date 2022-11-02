import * as React from 'react'
import { SliderProvider, SliderProgress, SliderNav, SliderTrack, Slide } from '@faceless-ui/slider'
import { Page } from '../../../payload-types'
import { ArrowIcon } from '../../icons/ArrowIcon'
import { ImageCard } from './ImageCard'
import { QuoteCard } from './QuoteCard'
import { useComputedCSSValues } from '../../providers/ComputedCSSValues'
import { PixelBackground } from '../../PixelBackground'

import classes from './index.module.scss'

const cardTypes = {
  imageSlider: ImageCard,
  quoteSlider: QuoteCard,
}

type Props = Extract<Page['layout'][0], { blockType: 'slider' }>

export const SliderBlock: React.FC<Props> = ({ sliderFields }) => {
  const { sliderType } = sliderFields

  const slides = sliderType === 'imageSlider' ? sliderFields.imageSlides : sliderFields.quoteSlides

  if (!slides || slides.length === 0) return null

  const CardToRender = cardTypes[sliderType]

  return (
    <React.Fragment>
      <div className={classes.controlsWrap}>
        <SliderProgress
          style={{
            height: '1px',
            marginTop: 'var(--base)',
            backgroundColor: 'var(--theme-elevation-200)',
          }}
          indicator={{
            style: {
              backgroundColor: 'var(--theme-elevation-500)',
            },
          }}
        />

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
      </div>

      <SliderTrack className={classes.sliderTrack}>
        <PixelBackground />
        {slides.map((slide, index) => {
          return (
            <Slide
              key={index}
              index={index}
              className={[classes.slide, classes[`slideIndex--${index}`]].filter(Boolean).join(' ')}
            >
              <CardToRender {...slide} />
            </Slide>
          )
        })}
      </SliderTrack>
    </React.Fragment>
  )
}

export const Slider: React.FC<Props> = props => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider slidesToShow={1.5} alignLastSlide="trackLeft" scrollOffset={gutterH}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}
