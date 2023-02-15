import { redirect } from 'next/navigation'

export default async ({ params }) =>
  redirect(`/dashboard/projects/${params.id}/settings/build-settings`)
