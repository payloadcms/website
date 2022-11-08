'use client'

import { BannerBlock, BannerBlockProps } from '@components/blocks/Banner'
import React from 'react'
import { StyleguidePageContent } from '../../PageContent'

const data: BannerBlockProps = {
  blockType: 'banner',
  bannerFields: {
    type: 'default',
    content: [
      {
        children: [
          {
            text: 'Enterprise-only access to the best that Payload provides.',
          },
        ],
        type: 'p',
      },
    ],
  },
}

const errorState: BannerBlockProps = {
  ...data,
  bannerFields: {
    ...data.bannerFields,
    type: 'error',
  },
}

const warningState: BannerBlockProps = {
  ...data,
  bannerFields: {
    ...data.bannerFields,
    type: 'warning',
  },
}

const successState: BannerBlockProps = {
  ...data,
  bannerFields: {
    ...data.bannerFields,
    type: 'success',
  },
}

const CardGridPage: React.FC = () => {
  return (
    <StyleguidePageContent title="Card Grid">
      <BannerBlock {...data} />
      <BannerBlock {...errorState} />
      <BannerBlock {...warningState} />
      <BannerBlock {...successState} />
    </StyleguidePageContent>
  )
}

export default CardGridPage
