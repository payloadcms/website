'use client'

import { MediaContent, MediaContentProps } from '@components/blocks/MediaContent'
import React from 'react'
import { StyleguidePageContent } from '../../PageContent'

const data: MediaContentProps = {
  blockType: 'mediaContent',
  mediaContentFields: {
    alignment: 'mediaContent',
    richText: [
      {
        children: [
          {
            text: 'Layout Builder',
          },
        ],
        type: 'label',
      },
      {
        children: [
          {
            text: 'Give your editors a page builder.',
          },
        ],
        type: 'h2',
      },
      {
        children: [
          {
            text: 'Give too much control and your site will start to look like a kaleidoscope. Give too little, and you’ll have editors harping on the dev team to create more features. ',
          },
        ],
      },
      {
        children: [
          {
            text: 'The Payload Blocks field is the best way to build enterprise websites that live up to marketing demands.',
          },
        ],
      },
    ],
    enableLink: true,
    link: {
      reference: undefined,
      type: 'custom',
      url: '/case-studies',
      label: 'Case Studies',
    },
    media: {
      id: '6364286ddfa8dcdc3a66ff75',
      alt: 'Screenshot of hope websites teal homepage overlaying a screenshot of the Payload CMS admin panel, used as an example to show what editing a page on the backend can produce content-wise for the frontend website.',
      filename: 'hope-media-content-1.png',
      mimeType: 'image/png',
      filesize: 337060,
      width: 968,
      height: 787,
      createdAt: '2022-11-03T20:45:33.742Z',
      updatedAt: '2022-11-03T20:45:33.742Z',
      url: '/media/hope-media-content-1.png',
    },
  },
}

const dataWithContainer: MediaContentProps = {
  ...data,
  mediaContentFields: {
    ...data.mediaContentFields,
    container: true,
  },
}

const dataContentOnLeft: MediaContentProps = {
  ...data,
  mediaContentFields: {
    ...data.mediaContentFields,
    alignment: 'contentMedia',
  },
}

const CardGridPage: React.FC = () => {
  return (
    <StyleguidePageContent title="Media Content" darkModePadding darkModeMargins>
      <MediaContent {...data} />
      <MediaContent {...dataWithContainer} />
      <MediaContent {...dataContentOnLeft} />
    </StyleguidePageContent>
  )
}

export default CardGridPage
