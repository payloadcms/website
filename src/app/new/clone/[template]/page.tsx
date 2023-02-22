'use client'

import React, { Fragment } from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useGlobals } from '@root/providers/Globals'
import { useCheckToken } from '@root/utilities/use-check-token'
import useDebounce from '@root/utilities/use-debounce'
import { useExchangeCode } from '../../../../utilities/use-exchange-code'
import { Authorize } from '../../Authorize'
import { CloneTemplate } from './CloneTemplate'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC<{
  params: Params
}> = ({ params: { template: templateParam } }) => {
  const { templates } = useGlobals()
  const matchedTemplate = templates.find(t => t.slug === templateParam)

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
                label: 'Clone',
                url: '/new/clone',
              },
              {
                label: matchedTemplate?.name,
              },
            ]}
          />
          <h1>Create new from template</h1>
        </div>
        {loading && <LoadingShimmer number={3} />}
        {exchangeError && <p>{exchangeError}</p>}
      </Gutter>
      {!loading && (error || !tokenIsValid) && (
        <Authorize
          onAuthorize={({ code }) => {
            exchangeCode(code)
          }}
        />
      )}
      {!loading && !error && tokenIsValid && <CloneTemplate template={matchedTemplate} />}
    </Fragment>
  )
}

export default ProjectFromTemplate
