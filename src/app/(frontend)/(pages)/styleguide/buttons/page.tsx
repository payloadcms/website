import React from 'react'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { Button } from '@components/Button/index.js'
import { StyleguidePageContent } from '../PageContent/index.js'

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
        <p>Default Pill</p>
        <div>
          <Button label="Create new" size="pill" />
        </div>
        <br />
        <p>Primary Pill</p>
        <div>
          <Button appearance="primary" label="Create new" size="pill" />
        </div>
        <br />
        <p>Pill</p>
        <div>
          <Button appearance="secondary" label="Create new" size="pill" />
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
        <br />
        <p>Danger with icon</p>
        <div>
          <Button appearance="danger" label="Delete" />
        </div>
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Buttons

export const metadata: Metadata = {
  title: 'Buttons',
}
