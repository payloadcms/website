import React from 'react'
import { Button } from '../../../components/Button'
import { App } from '../../App'
import { StyleguidePageContent } from '../PageContent'

const Buttons: React.FC = () => {
  return (
    <App>
      <StyleguidePageContent title="Buttons">
        <div>
          <p>Default</p>
          <div>
            <Button label="Learn more" />
          </div>
          <br />
          <p>Default with icon</p>
          <div>
            <Button label="Learn more" icon="arrow" />
          </div>
          <br />
          <p>Primary</p>
          <div>
            <Button appearance="primary" label="Create new project" />
          </div>
          <br />
          <p>Primary with icon</p>
          <div>
            <Button appearance="primary" label="Create new project" icon="arrow" />
          </div>
          <br />
          <p>Secondary</p>
          <div>
            <Button appearance="secondary" label="Read the docs" />
          </div>
          <br />
          <p>Secondary with icon</p>
          <div>
            <Button appearance="secondary" label="Read the docs" icon="arrow" />
          </div>
        </div>
      </StyleguidePageContent>
    </App>
  )
}

export default Buttons
