'use client'

import React, { Fragment } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import useDebounce from '@root/utilities/use-debounce'
import { useCheckToken } from '../../../utilities/use-check-token'
import { useExchangeCode } from '../../../utilities/use-exchange-code'
import { Authorize } from '../Authorize'
import { ImportProject } from './ImportProject'

import classes from './index.module.scss'

const ProjectFromImport: React.FC = () => {
  const { error: exchangeError, hasExchangedCode, exchangeCode } = useExchangeCode()

  const {
    tokenIsValid,
    loading: tokenLoading,
    error,
  } = useCheckToken({
    hasExchangedCode,
  })

  const loading = useDebounce(tokenLoading, 1000)

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
        {loading && <LoadingShimmer number={3} />}
        {exchangeError && <p>{exchangeError}</p>}
      </Gutter>
      {!loading && (error || !tokenIsValid) && <Authorize onAuthorize={exchangeCode} />}
      {!loading && !error && tokenIsValid && <ImportProject />}
    </Fragment>
  )
}

export default ProjectFromImport
