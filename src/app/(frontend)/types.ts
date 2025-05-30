import type { Project, Team } from '@root/payload-cloud-types'

export type ProjectDeployResponse = { team: Pick<Team, 'id' | 'slug'> } & Pick<
  Project,
  'id' | 'plan' | 'slug'
>
