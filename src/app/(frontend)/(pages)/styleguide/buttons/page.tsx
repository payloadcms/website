import type { Metadata } from 'next'

import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index'

const Buttons: React.FC = () => {
  return (
    <StyleguidePageContent darkModeMargins darkModePadding title="Buttons">
      <Gutter>
        <p>Default</p>
        <div>
          <Button label="Learn more" />
        </div>
        <br />
        <p>Default with icon</p>
        <div>
          <Button icon="arrow" label="Learn more" />
        </div>
        <br />
        <p>Default with regular label</p>
        <div>
          <Button icon="arrow" label="Learn more" labelStyle="regular" />
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
          <Button appearance="primary" icon="arrow" label="Create new project" />
        </div>
        <br />
        <p>Secondary</p>
        <div>
          <Button appearance="secondary" label="Read the docs" />
        </div>
        <br />
        <p>Secondary with icon</p>
        <div>
          <Button appearance="secondary" icon="arrow" label="Read the docs" />
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
