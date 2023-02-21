import React, { Fragment } from 'react'
import { TemplatesBlock } from '@blocks/TemplatesBlock'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

const NewProject: React.FC = () => {
  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <div className={classes.headerContent}>
            <Heading element="h1" marginTop={false}>
              New project
            </Heading>
            <p className={classes.description}>
              Create a project from a template, or import an existing Git codebase.
            </p>
          </div>
          <Button
            label="Import existing codebase"
            href="/new/import"
            appearance="primary"
            el="link"
          />
        </div>
      </Gutter>
      <TemplatesBlock />
      <Gutter>
        <div className={classes.callToAction}>
          <h6>Payload Cloud is the best way to deploy a Payload project.</h6>
          <p>
            {`Get a quick-start with one of our `}
            <Link href="/new/templates">pre-built templates</Link>
            {`, or deploy your own `}
            <Link href="/new/clone">existing</Link>
            {` Payload codebase.`}
          </p>
        </div>
      </Gutter>
    </Fragment>
  )
}

export default NewProject
