import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { canUserMangeProject } from '@root/access.js'
import { MaxWidth } from '@components/MaxWidth/index.js'
import { Plan } from '@root/payload-cloud-types.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc.js'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants.js'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index.js'
import { DeletePlanButton } from './DeletePlanButton/index.js'
import { DeletePlanModal } from './DeletePlanModal/index.js'

import classes from './index.module.scss'
import { generateRoutePath } from '@root/utilities/generate-route-path.js'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
    'environment-slug': string
  }>
}) => {
  const {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
  } = await params
  const { user } = await fetchMe()
  const { project } = await fetchProjectAndRedirect({
    teamSlug,
    projectSlug,
    environmentSlug,
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
            confirmSlug={project.slug}
            canManageProject={canManageProject}
            project={project}
            environmentSlug={environmentSlug}
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
    'team-slug': string
    'project-slug': string
    'environment-slug': string
  }>
}): Promise<Metadata> {
  const {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
  } = await params
  return {
    title: 'Plan',
    openGraph: mergeOpenGraph({
      title: 'Plan',
      url: generateRoutePath({
        teamSlug,
        projectSlug,
        environmentSlug,
        suffix: 'settings/plan',
      }),
    }),
  }
}
