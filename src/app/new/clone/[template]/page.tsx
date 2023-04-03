'use client'

import React, { Fragment } from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useGlobals } from '@root/providers/Globals'
import { useGitAuthRedirect } from '../../authorize/useGitAuthRedirect'
import { CloneTemplate } from './CloneTemplate'

import classes from './index.module.scss'

const title = `Create new from template`

const ProjectFromTemplate: React.FC<{
  params: Params
}> = ({ params: { template: templateParam } }) => {
  const { templates } = useGlobals()
  const matchedTemplate = templates.find(t => t.slug === templateParam)

  const { tokenLoading, tokenIsValid } = useGitAuthRedirect()

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
          <Heading marginTop={false} element="h1">
            {title}
          </Heading>
        </div>
        {tokenLoading && <LoadingShimmer number={3} />}
      </Gutter>
      {!tokenLoading && tokenIsValid && <CloneTemplate template={matchedTemplate} />}
    </Fragment>
  )
}

export default ProjectFromTemplate
