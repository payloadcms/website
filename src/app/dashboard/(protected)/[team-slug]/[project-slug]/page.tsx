import { redirect } from 'next/navigation'

export default async ({ params }) => {
  const { 'team-slug': teamSlug, 'project-slug': projectSlug } = params

  redirect(`/dashboard/${teamSlug}/${projectSlug}/overview`)
}
