import React, { Fragment } from 'react'
import { TemplatesBlock } from '@blocks/TemplatesBlock'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC = () => {
  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <Breadcrumbs
            items={[
              {
                label: 'New',
                url: '/new',
              },
              {
                label: 'Template',
              },
            ]}
          />
          <h1>Create new from template</h1>
        </div>
      </Gutter>
      <TemplatesBlock />
    </Fragment>
  )
}

export default ProjectFromTemplate
