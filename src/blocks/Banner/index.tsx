import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '@components/Gutter'
import { Banner, Props as BannerProps } from '@components/Banner'
import { ReusableContent } from '@root/payload-types'

export type BannerBlockProps = Extract<ReusableContent['layout'][0], { blockType: 'banner' }>

export const BannerBlock: React.FC<BannerBlockProps> = ({ bannerFields }) => {
  const bannerProps: BannerProps = {
    type: bannerFields.type,
    content: bannerFields.content,
    icon: bannerFields.addCheckmark ? 'checkmark' : undefined,
  }

  return (
    <Gutter>
      <Grid>
        <Cell start={3} cols={8} startM={2} colsM={6} startS={1} colsS={8}>
          <Banner {...bannerProps} />
        </Cell>
      </Grid>
    </Gutter>
  )
}
