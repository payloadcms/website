import React from 'react'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { StyleguidePageContent } from '../PageContent/index.js'

const Highlight: React.FC = () => {
  return (
    <StyleguidePageContent title="Highlight" darkModePadding darkModeMargins>
      <Gutter>
        <RichText
          content={[
            {
              type: 'h1',
              children: [
                {
                  text: 'App frameworks give you a backend, but lack CMS-grade UI. ',
                },
                {
                  text: 'Payload gives you both.',
                  underline: true,
                },
                {
                  text: ' Extend everything, build anything.',
                },
              ],
            },
            {
              type: 'p',
              children: [
                {
                  text: 'Payload is much more than a CMS—it’s just as much a CMS as it is an application framework. Its extensibility allows it to power everything from enterprise websites to native apps. It’ll never hold you back.',
                },
              ],
            },
          ]}
        />
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Highlight

export const metadata: Metadata = {
  title: 'Highlight',
}
