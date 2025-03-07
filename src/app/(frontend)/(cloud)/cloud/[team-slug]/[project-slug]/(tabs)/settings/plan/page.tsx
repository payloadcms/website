import type { Plan } from '@root/payload-cloud-types'
import type { Metadata } from 'next'

import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { MaxWidth } from '@components/MaxWidth/index'
import { canUserMangeProject } from '@root/access'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { generateRoutePath } from '@root/utilities/generate-route-path'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc'

import { SectionHeader } from '../_layoutComponents/SectionHeader/index'
import { DeletePlanButton } from './DeletePlanButton/index'
import { DeletePlanModal } from './DeletePlanModal/index'
import classes from './index.module.scss'

export default async ({
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  const { user } = await fetchMe()
  const { project } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })
  const canManageProject = canUserMangeProject({ project, user })

  return (
    <MaxWidth className={classes.plan}>
      {project?.plan && isExpandedDoc<Plan>(project.plan) && (
        <div>
          <SectionHeader title="Current Plan" />
          <div className={classes.borderBox}>
            <h4>{project.plan.name}</h4>
            <p className={classes.downgradeText}>
              To downgrade or upgrade your plan, please{' '}
              <a href="mailto:info@payloadcms.com?subject=Downgrade/Upgrade Cloud Plan&body=Hi! I would like to change my cloud plan.">
                contact us
              </a>{' '}
              and we will change your plan for you. This is temporary until we have a self-service
              plan change feature.
            </p>
          </div>
        </div>
      )}
      {canManageProject && project?.slug && (
        <div>
          <SectionHeader title="Delete Project" />
          <div className={classes.borderBox}>
            <h4>Warning</h4>
            <p className={classes.downgradeText}>
              Once you delete a project, there is no going back so please be certain. We recommend
              exporting your database before deleting.
            </p>
            <DeletePlanButton />
          </div>
          <DeletePlanModal
            canManageProject={canManageProject}
            confirmSlug={project.slug}
            environmentSlug={environmentSlug}
            project={project}
          />
        </div>
      )}
    </MaxWidth>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}): Promise<Metadata> {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  return {
    openGraph: mergeOpenGraph({
      title: 'Plan',
      url: generateRoutePath({
        environmentSlug,
        projectSlug,
        suffix: 'settings/plan',
        teamSlug,
      }),
    }),
    title: 'Plan',
  }
}
