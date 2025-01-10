import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import type { Project } from '@root/payload-cloud-types'

type Props<ReturnProject = Project> = {
  environmentSlug: string
  project: ProjectWithSubscription | ReturnProject
}
export function mergeProjectEnvironment({ environmentSlug, project }: Props) {
  return {
    ...project,
    ...(project?.environments?.find(
      ({ environmentSlug: projectEnvironmentSlug }) => projectEnvironmentSlug === environmentSlug,
    ) || {}),
    id: project.id,
  }
}
