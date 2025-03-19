import type { Customer, TeamWithCustomer } from './fetchTeam'

export const updateCustomer = async (
  team: null | TeamWithCustomer | undefined,
  customer: Partial<Customer>,
): Promise<Customer> => {
  const sub = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/customer`,
    {
      body: JSON.stringify(customer),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    },
  )?.then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to update customer`)
    }
    return res.json()
  })

  return sub
}
