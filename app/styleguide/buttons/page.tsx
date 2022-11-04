import { Gutter } from '@components/Gutter'
import React from 'react'
import { Button } from '../../../components/Button'
import { StyleguidePageContent } from '../PageContent'

const Buttons: React.FC = () => {
  return (
    <StyleguidePageContent title="Buttons" darkModePadding darkModeMargins>
      <Gutter>
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
        <p>Default with regular label</p>
        <div>
          <Button label="Learn more" icon="arrow" labelStyle="regular" />
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
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Buttons
