import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { Repo } from '@cloud/_api/fetchRepos.js'

import type { Project, User } from '@root/payload-cloud-types.js'

export const createDraftProject = async ({
  projectName,
  installID,
  templateID,
  teamID,
  onSubmit,
  user,
  repo,
  makePrivate,
}: {
  projectName?: string
  installID: number | undefined
  onSubmit?: (project: Project) => void // eslint-disable-line no-unused-vars
  templateID?: string // only applies to `clone` flow
  teamID: string | undefined
  user: User | null | undefined
  repo: Partial<Repo>
  makePrivate?: boolean
}): Promise<void> => {
  if (!user) {
    throw new Error('You must be logged in to create a project')
  }

  if (!user.teams || user.teams.length === 0) {
    throw new Error('You must be a member of a team to create a project')
  }

  try {
    const draftProject: Partial<Project> = {
      name: projectName || repo?.name || 'Untitled Project',
      installID: installID ? installID.toString() : undefined,
      team:
        teamID ||
        // fallback to first team
        (typeof user.teams?.[0]?.team === 'string'
          ? user.teams?.[0]?.team
          : user.teams?.[0]?.team?.id),
      defaultDomain: undefined,
      repositoryID: repo?.id ? repo.id.toString() : undefined, // only applies to the `import` flow
      repositoryName: repo?.name,
      repositoryFullName: repo?.full_name,
      template: templateID,
      makePrivate,
      // `buildScript`, `installScript`, and `runScript` are automatically set by the API based on any `package-lock.json` found in the repo
      // the user can change these later to whatever they want, but this prevents the user from having `yarn` commands set on an `npm` project, for example
    }

    const projectReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftProject),
    })

    const { doc: project, errors: projectErrs } = await projectReq.json()

    if (projectReq.ok) {
      await revalidateCache({
        tag: 'projects',
      })

      if (typeof onSubmit === 'function') {
        await onSubmit(project)
      }
    } else {
      throw new Error(projectErrs[0].message)
    }
  } catch (err: unknown) {
    console.error(err) // eslint-disable-line no-console
    throw new Error(err instanceof Error ? err.message : 'Something went wrong')
  }
}
