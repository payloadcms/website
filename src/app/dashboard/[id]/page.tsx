import { redirect } from 'next/navigation'

export default async function OverviewRedirect({ params }) {
  redirect(`/dashboard/projects/${params.id}/overview`)
}
