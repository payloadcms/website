import { redirect } from 'next/navigation'

export default async function Redirect({ params }) {
  await redirect(`/dashboard/${params.id}/overview`)

  return null
}
