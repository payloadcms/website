import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useWindowInfo } from '@faceless-ui/window-info'
import React, { useId } from 'react'

import { StickyHighlight } from './Highlight/index'
import classes from './index.module.scss'

type Props = {
  className?: string
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

export const StickyHighlights: React.FC<Props> = ({
  className,
  hideBackground,
  padding,
  stickyHighlightsFields,
}) => {
  const { highlights, settings } = stickyHighlightsFields || {}
  const { yDirection } = useScrollInfo()
  const {
    breakpoints: { m },
  } = useWindowInfo()

  const id = useId()

  return (
    <BlockWrapper
      className={[classes.stickyHighlights, className].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      id={id}
      padding={padding}
      settings={settings}
    >
      <Gutter>
        <BackgroundGrid zIndex={0} />
        {highlights?.map((highlight, i) => {
          return <StickyHighlight key={i} midBreak={m} yDirection={yDirection} {...highlight} />
        })}
      </Gutter>
    </BlockWrapper>
  )
}
