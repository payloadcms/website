import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Metadata } from 'next'

import { Heading } from '@components/Heading'
import { Highlight } from '@components/Highlight'
import { canUserMangeProject } from '@root/access'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Plan } from '@root/payload-cloud-types'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { isExpandedDoc } from '@root/utilities/is-expanded-doc'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { DeletePlanButton } from './DeletePlanButton'
import { DeletePlanModal } from './DeletePlanModal'

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
            <Heading className={classes.highlightHeading} element="p" as="h4" margin={false}>
              <Highlight text={project.plan.name} />
            </Heading>
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
            <Heading className={classes.warningHeading} element="p" as="h4" margin={false}>
              <Highlight appearance="danger" text="Warning" />
            </Heading>
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
