import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { ReusableContent } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import { Banner, Props as BannerProps } from '../../Banner'

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
