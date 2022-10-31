import React from 'react'
import { ArrowIcon } from '../../../components/icons/ArrowIcon'
import { SearchIcon } from '../../../components/icons/SearchIcon'
import { App } from '../../App'
import { StyleguidePageContent } from '../PageContent'

const Highlight: React.FC = () => {
  return (
    <App>
      <StyleguidePageContent title="Icons">
        <div>
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
        </div>
      </StyleguidePageContent>
    </App>
  )
}

export default Highlight
