import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { ReusableContent } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import { Banner, Props as BannerProps } from '../../Banner'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'banner' }>

export const BannerBlock: React.FC<Props> = ({ bannerFields }) => {
  const bannerProps: BannerProps = {
    type: bannerFields.type,
    content: bannerFields.content,
    icon: bannerFields.addCheckmark ? 'checkmark' : undefined,
  }

  return (
    <Gutter>
      <Grid>
        <Cell>
          <Banner {...bannerProps} />
        </Cell>
      </Grid>
    </Gutter>
  )
}
