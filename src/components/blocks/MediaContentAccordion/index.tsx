import type { PaddingProps } from '@components/BlockWrapper/index.js';
import type { Page } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter/index.js'
import React from 'react'

import { DesktopMediaContentAccordion } from './Desktop/index.js'
import classes from './index.module.scss'
import { MobileMediaContentAccordion } from './Mobile/index.js'

export type MediaContentAccordionProps = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<
  Page['layout'][0],
  { blockType: 'mediaContentAccordion' }
>

export const MediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  hideBackground,
  mediaContentAccordionFields,
  padding,
}) => {
  const { settings } = mediaContentAccordionFields || {}

  return (
    <BlockWrapper
      className={[classes.mediaContentAccordion].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      padding={padding}
      settings={settings}
    >
      <Gutter>
        <BackgroundGrid zIndex={0} />
        <DesktopMediaContentAccordion
          blockType="mediaContentAccordion"
          className={classes.desktop}
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
        <MobileMediaContentAccordion
          blockType="mediaContentAccordion"
          className={classes.mobile}
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
      </Gutter>
    </BlockWrapper>
  )
}
