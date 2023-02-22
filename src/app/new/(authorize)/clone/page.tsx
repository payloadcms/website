import React, { Fragment } from 'react'
import { TemplatesBlock } from '@blocks/TemplatesBlock'
import Link from 'next/link'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC = () => {
  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <Breadcrumbs items={[{ url: '/new', label: 'New' }, { label: 'Clone' }]} />
          <h1>Create new from template</h1>
          <p className={classes.description}>
            {`Not seeing what you're looking for? `}
            <Link href="/new/templates">See all of our templates</Link>
            {' or '}
            <Link href="/new/import">import an existing codebase</Link>
            {'.'}
          </p>
        </div>
      </Gutter>
      <TemplatesBlock />
    </Fragment>
  )
}

export default ProjectFromTemplate
