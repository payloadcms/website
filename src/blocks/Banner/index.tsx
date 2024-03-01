import React from 'react'

import { Banner, Props as BannerProps } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import { ReusableContent } from '@root/payload-types'

export type BannerBlockProps = Extract<ReusableContent['layout'][0], { blockType: 'banner' }>

export const BannerBlock: React.FC<{
  bannerFields: BannerBlockProps['bannerFields']
  marginAdjustment?: boolean
  disableGutter?: boolean
}> = ({ bannerFields, disableGutter, marginAdjustment }) => {
  const bannerProps: BannerProps = {
    type: bannerFields.type,
    content: bannerFields.content,
    icon: bannerFields.addCheckmark ? 'checkmark' : undefined,
    marginAdjustment: marginAdjustment,
  }

  return (
    <>
      {disableGutter ? (
        <Banner {...bannerProps} />
      ) : (
        <Gutter>
          <div className={'grid'}>
            <div className={'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1'}>
              <Banner {...bannerProps} />
            </div>
          </div>
        </Gutter>
      )}
    </>
  )
}
