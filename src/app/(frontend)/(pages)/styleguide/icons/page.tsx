import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import { SearchIcon } from '@icons/SearchIcon/index.js'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { StyleguidePageContent } from '../PageContent/index.js'

const Highlight: React.FC = () => {
  return (
    <StyleguidePageContent title="Icons" darkModePadding darkModeMargins>
      <Gutter>
        <p>Icons</p>
        <div>
          <ArrowIcon />
          &nbsp;&nbsp;
          <SearchIcon />
        </div>
        <br />
        <p>Icons - bold</p>
        <div>
          <ArrowIcon bold />
          &nbsp;&nbsp;
          <SearchIcon bold />
        </div>
        <br />
        <p>Icons - Large</p>
        <div>
          <ArrowIcon size="large" />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <SearchIcon size="large" />
        </div>
        <br />
        <p>Icons - Large Bold</p>
        <div>
          <ArrowIcon bold size="large" />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <SearchIcon bold size="large" />
        </div>
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Highlight

export const metadata: Metadata = {
  title: 'Icons',
}
