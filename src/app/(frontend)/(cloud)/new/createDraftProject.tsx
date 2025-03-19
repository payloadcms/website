import type { Repo } from '@cloud/_api/fetchRepos'
import type { Project, User } from '@root/payload-cloud-types'

import { revalidateCache } from '@cloud/_actions/revalidateCache'

export const createDraftProject = async ({
  installID,
  makePrivate,
  onSubmit,
  projectName,
  repo,
  teamID,
  templateID,
  user,
}: {
  installID: number | undefined
  makePrivate?: boolean
  onSubmit?: (project: Project) => void
  projectName?: string
  repo: Partial<Repo>
  teamID: string | undefined
  templateID?: string // only applies to `clone` flow
  user: null | undefined | User
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
      defaultDomain: undefined,
      installID: installID ? installID.toString() : undefined,
      makePrivate,
      repositoryFullName: repo?.full_name,
      repositoryID: repo?.id ? repo.id.toString() : undefined, // only applies to the `import` flow
      repositoryName: repo?.name,
      team:
        teamID ||
        // fallback to first team
        (typeof user.teams?.[0]?.team === 'string'
          ? user.teams?.[0]?.team
          : user.teams?.[0]?.team?.id),
      template: templateID,
      // `buildScript`, `installScript`, and `runScript` are automatically set by the API based on any `package-lock.json` found in the repo
      // the user can change these later to whatever they want, but this prevents the user from having `yarn` commands set on an `npm` project, for example
    }

    const projectReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects`, {
      body: JSON.stringify(draftProject),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
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
