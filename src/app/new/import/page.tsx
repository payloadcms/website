'use client'

import React, { Fragment } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useCheckToken } from '../../../utilities/use-check-token'
import { useExchangeCode } from '../../../utilities/use-exchange-code'
import { Authorize } from '../Authorize'
import { ImportProject } from './ImportProject'

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
      {!loading && !error && tokenIsValid && <ImportProject />}
    </Fragment>
  )
}

export default ProjectFromImport
