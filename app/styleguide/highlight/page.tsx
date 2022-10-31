import React from 'react'
import { RichText } from '../../../components/RichText'
import { App } from '../../App'
import { StyleguidePageContent } from '../PageContent'

const Highlight: React.FC = () => {
  return (
    <App>
      <StyleguidePageContent title="Highlight">
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
      </StyleguidePageContent>
    </App>
  )
}

export default Highlight
