import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index'

const Typography: React.FC = () => {
  return (
    <StyleguidePageContent darkModeMargins darkModePadding title="Typography">
      <Gutter>
        <h1>Typography</h1>
        <h1>H1: Lorem ipsum dolor sit amet officia deserunt.</h1>
        <h2>H2: Lorem ipsum dolor sit amet in culpa qui officia deserunt consectetur.</h2>
        <h3>
          H3: Lorem ipsum dolor sit amet in culpa qui officia deserunt consectetur adipiscing elit.
        </h3>
        <h4>
          H4: Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </h4>
        <h5>
          H5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </h5>
        <h6>
          H6: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </h6>
        <p>
          P: Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. dolore magna aliqua.
          Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem
          ipsum dolor sit amet in culpa qui officia deserunt consectetur adipiscing elit.
        </p>
        <p style={{ color: 'var(--theme-text-success)' }}>
          Success: Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. dolore magna
          aliqua. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet in culpa qui officia deserunt consectetur adipiscing elit.
        </p>
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Typography

export const metadata: Metadata = {
  title: 'Typography',
}
