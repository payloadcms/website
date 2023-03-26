import { redirect } from 'next/navigation'

export default async ({ searchParams }) => {
  const { team } = searchParams

  if (team) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/accept-invitation`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (e) {
      throw new Error(`Error accepting invitation: ${e.message}`)
    }

    redirect(
      `/cloud/${team?.slug}?message=${encodeURIComponent(
        `Succeess! You have joined the team ${team?.name}`,
      )}`,
    )
  }

  return null
}
