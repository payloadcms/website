import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Page } from '@root/payload-types.js'
import { DesktopMediaContentAccordion } from './Desktop/index.js'
import { MobileMediaContentAccordion } from './Mobile/index.js'

import classes from './index.module.scss'

export type MediaContentAccordionProps = Extract<
  Page['layout'][0],
  { blockType: 'mediaContentAccordion' }
> & {
  padding: PaddingProps
  hideBackground?: boolean
}

export const MediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  mediaContentAccordionFields,
  padding,
  hideBackground,
}) => {
  const { settings } = mediaContentAccordionFields || {}

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
      hideBackground={hideBackground}
      className={[classes.mediaContentAccordion].filter(Boolean).join(' ')}
    >
      <Gutter>
        <BackgroundGrid zIndex={0} />
        <DesktopMediaContentAccordion
          className={classes.desktop}
          blockType="mediaContentAccordion"
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
        <MobileMediaContentAccordion
          className={classes.mobile}
          blockType="mediaContentAccordion"
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
      </Gutter>
    </BlockWrapper>
  )
}
