import * as React from 'react'

import { Heading } from '@components/Heading'

const BuildSettingsPage = async () => {
  return (
    <div>
      <Heading element="h2" as="h4" marginTop={false}>
        Build Settings
      </Heading>

      <p>Project name</p>

      <p>Install command</p>

      <p>Build command</p>

      <p>Branch to deploy</p>
    </div>
  )
}

export default BuildSettingsPage
