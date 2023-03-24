import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'
import { SearchIcon } from '@icons/SearchIcon'

import { Gutter } from '@components/Gutter'
import { StyleguidePageContent } from '../PageContent'

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
