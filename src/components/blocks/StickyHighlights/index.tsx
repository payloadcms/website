import React, { useId } from 'react'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useWindowInfo } from '@faceless-ui/window-info'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Page } from '@root/payload-types.js'
import { StickyHighlight } from './Highlight/index.js'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }> & {
  className?: string
  padding: PaddingProps
  hideBackground?: boolean
}

export const StickyHighlights: React.FC<Props> = ({
  stickyHighlightsFields,
  className,
  padding,
  hideBackground,
}) => {
  const { highlights, settings } = stickyHighlightsFields || {}
  const { yDirection } = useScrollInfo()
  const {
    breakpoints: { m },
  } = useWindowInfo()

  const id = useId()

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
      hideBackground={hideBackground}
      className={[classes.stickyHighlights, className].filter(Boolean).join(' ')}
      id={id}
    >
      <Gutter>
        <BackgroundGrid zIndex={0} />
        {highlights?.map((highlight, i) => {
          return <StickyHighlight yDirection={yDirection} midBreak={m} key={i} {...highlight} />
        })}
      </Gutter>
    </BlockWrapper>
  )
}
