'use client'

import React, { Fragment } from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useGlobals } from '@root/providers/Globals'
import { CloneTemplate } from './CloneTemplate'

import classes from './index.module.scss'

const ProjectFromTemplate: React.FC<{
  params: Params
}> = ({ params: { template: templateParam } }) => {
  const { templates } = useGlobals()
  const matchedTemplate = templates.find(t => t.slug === templateParam)

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
      </Gutter>
      {<CloneTemplate template={matchedTemplate} />}
    </Fragment>
  )
}

export default ProjectFromTemplate
