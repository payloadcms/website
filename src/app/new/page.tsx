import React, { Fragment } from 'react'
import { TemplatesBlock } from '@blocks/TemplatesBlock'

import { BlockSpacing } from '@components/BlockSpacing'
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
      <BlockSpacing top={false}>
        <TemplatesBlock />
      </BlockSpacing>
    </Fragment>
  )
}

export default NewProject
