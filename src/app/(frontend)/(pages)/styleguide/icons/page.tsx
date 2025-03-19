import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index'
import { ArrowIcon } from '@icons/ArrowIcon/index'
import { SearchIcon } from '@icons/SearchIcon/index'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index'

const Highlight: React.FC = () => {
  return (
    <StyleguidePageContent darkModeMargins darkModePadding title="Icons">
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
