import { ProjectWithSubscription } from "@cloud/_api/fetchProject"
import { Project } from "@root/payload-cloud-types"

type Props<ReturnProject = Project> = {
  environmentSlug: string
  project: ReturnProject | ProjectWithSubscription
}
export function mergeProjectEnvironment({ environmentSlug, project }: Props) {
  return {
    ...project,
    ...(project?.environments?.find(({ environmentSlug: projectEnvironmentSlug }) => projectEnvironmentSlug === environmentSlug) || {}),
    id: project.id,
  }
}