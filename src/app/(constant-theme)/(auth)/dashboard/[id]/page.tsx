import { redirect } from 'next/navigation'

export default async function Redirect({ params }) {
  redirect(`/dashboard/${params.id}/overview`)
}
