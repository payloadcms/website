'use client'

import React, { Fragment } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useExchangeCode } from '../useExchangeCode'
import { Authorize } from './Authorize'
import { CreateProjectFromImport } from './CreateProject'
import { useCheckToken } from './useCheckToken'

import classes from './index.module.scss'

const ProjectFromImport: React.FC = () => {
  const { error: exchangeError, hasExchangedCode } = useExchangeCode()
  const { tokenIsValid, loading, error } = useCheckToken({
    hasExchangedCode,
  })

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
              },
            ]}
          />
          <h1>Import a codebase</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {exchangeError && <p>{exchangeError}</p>}
      </Gutter>
      {!loading && (error || !tokenIsValid) && <Authorize />}
      {!loading && !error && tokenIsValid && <CreateProjectFromImport />}
    </Fragment>
  )
}

export default ProjectFromImport
