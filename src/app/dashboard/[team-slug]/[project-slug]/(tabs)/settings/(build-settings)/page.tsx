import * as React from 'react'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'

import { Heading } from '@components/Heading'

import classes from './index.module.scss'

export default async () => {
  return (
    <div>
      <Heading element="h2" as="h4" marginTop={false}>
        Build Settings
      </Heading>

      <Form className={classes.form}>
        <Text label="Project name" placeholder="Enter a name for your project" path="projectName" />

        <Text
          label="Install Command"
          placeholder="Enter the command to install your project dependencies"
          path="installCommand"
        />

        <Text
          label="Build Command"
          placeholder="Enter the command to build your project"
          path="buildCommand"
        />

        <Text
          label="Branch to deploy"
          placeholder="Enter the branch to deploy"
          path="branchToDeploy"
        />

        <div>
          <Submit label="Update" />
        </div>
      </Form>
    </div>
  )
}
