import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { canUserMangeProject } from '@root/access.js'
import { MaxWidth } from '@components/MaxWidth/index.js'
import { Plan } from '@root/payload-cloud-types.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc.js'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index.js'
import { DeletePlanButton } from './DeletePlanButton/index.js'
import { DeletePlanModal } from './DeletePlanModal/index.js'

import classes from './index.module.scss'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { user } = await fetchMe()
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
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
          />
        </div>
      )}
    </MaxWidth>
  )
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Plan',
    openGraph: mergeOpenGraph({
      title: 'Plan',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/plan`,
    }),
  }
}
