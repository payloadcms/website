'use client'

import React from 'react'
import { LinkGrid, LinkGridProps } from '@blocks/LinkGrid'

import { StyleguidePageContent } from '../../PageContent'

const data: LinkGridProps = {
  blockType: 'linkGrid',
  linkGridFields: {
    links: [
      {
        link: {
          type: 'custom',
          url: '/',
          label: 'Learn about Payload’s Access Control',
          reference: null,
        },
        id: '636c1ccf10f2d6ed1ab96ac0',
      },
      {
        link: {
          type: 'custom',
          url: '/',
          label: 'Watch a video to see how to set up multi-tenant architecture',
          reference: null,
        },
        id: '636c1d0e10f2d6ed1ab96ac1',
      },
    ],
  },
  id: '636c1ca910f2d6ed1ab96abf',
}

const CardGridPage: React.FC = () => {
  return (
    <StyleguidePageContent title="Link Grid" darkModePadding darkModeMargins>
      <LinkGrid {...data} />
    </StyleguidePageContent>
  )
}

export default CardGridPage
