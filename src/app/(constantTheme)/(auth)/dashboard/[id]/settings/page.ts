import { redirect } from 'next/navigation'

export default async function OverviewRedirect({ params }): Promise<null> {
  // `await` is a workaround for next failing build when using redirect
  // https://beta.nextjs.org/docs/api-reference/redirect#thread-id=B1c08
  await redirect(`/dashboard/projects/${params.id}/settings/build-settings`)

  return null
}
