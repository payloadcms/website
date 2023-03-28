'use client'

import React, { Fragment } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useGitAuthRedirect } from '../authorize/useGitAuthRedirect'
import { ImportProject } from './ImportProject'

const title = `Import a codebase`

const ProjectFromImport: React.FC = () => {
  const { tokenLoading, tokenIsValid } = useGitAuthRedirect()

  return (
    <Fragment>
      <Gutter>
        <div>
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
          <h1>{title}</h1>
        </div>
        {tokenLoading && <LoadingShimmer number={3} />}
      </Gutter>
      {!tokenLoading && tokenIsValid && <ImportProject />}
    </Fragment>
  )
}

export default ProjectFromImport
