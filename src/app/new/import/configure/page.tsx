import React, { Fragment } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'

import classes from './index.module.scss'

const ConfigureFromImport: React.FC = () => {
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
                label: 'Import',
                url: '/new/import',
              },
              {
                label: 'Configure',
              },
            ]}
          />
          <h1>Configure your project</h1>
        </div>
      </Gutter>
    </Fragment>
  )
}

export default ConfigureFromImport
