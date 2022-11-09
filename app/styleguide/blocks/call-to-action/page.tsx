'use client'

import { CallToAction, CallToActionProps } from '@components/blocks/CallToAction'
import React from 'react'
import { StyleguidePageContent } from '../../PageContent'

const data: CallToActionProps = {
  blockType: 'cta',
  ctaFields: {
    richText: [
      {
        children: [
          {
            text: 'Deploy a new CMS instantly.',
          },
        ],
        type: 'h3',
      },
      {
        children: [
          {
            text: 'Payload is free and open source. You can host it yourself, or let us handle hosting for you on Payload Cloud.',
          },
        ],
      },
    ],
    feature: 'cpa',
    links: [
      {
        link: {
          type: 'custom',
          url: '/',
          label: 'Create new project',
          reference: null,
        },
        id: '636ae0dadcfd6be2845199a4',
      },
    ],
  },
}

const CallToActionPage: React.FC = () => {
  return (
    <StyleguidePageContent title="Call To Action">
      <CallToAction {...data} />
    </StyleguidePageContent>
  )
}

export default CallToActionPage
