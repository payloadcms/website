'use client'

import React from 'react'
import { CardGrid, CardGridProps } from '@blocks/CardGrid'

import { StyleguidePageContent } from '../../PageContent'

const data: CardGridProps = {
  blockType: 'cardGrid',
  cardGridFields: {
    richText: [
      {
        children: [
          {
            text: 'Enterprise-only access to the best that Payload provides.',
          },
        ],
        type: 'h4',
      },
    ],
    links: [],
    cards: [
      {
        title: 'Enterprise plugins like SSO',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '6364168102eff70ff444ba0b',
      },
      {
        title: 'Support SLA',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '636416ab02eff70ff444ba0c',
      },
      {
        title: 'Customer Success Manager',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '636416b702eff70ff444ba0d',
      },
      {
        title: 'Shared Slack Channel',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '636416ca02eff70ff444ba0e',
      },
      {
        title: 'Influence over product roadmap',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '636416de02eff70ff444ba0f',
      },
      {
        title: 'Quarterly Business Reviews',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '636416eb02eff70ff444ba10',
      },
      {
        title: 'Dedicated development help',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '636416f702eff70ff444ba11',
      },
      {
        title: 'Custom plugin development',
        description: 'A powerful pattern to add your own logic.',
        enableLink: false,
        link: {
          type: 'custom',
          url: '/',
          // @ts-expect-error
          reference: null,
        },
        id: '6364170c02eff70ff444ba12',
      },
    ],
  },
}

const CardGridPage: React.FC = () => {
  return (
    <StyleguidePageContent title="Card Grid">
      <CardGrid {...data} />
    </StyleguidePageContent>
  )
}

export default CardGridPage
