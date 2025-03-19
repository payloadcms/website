import type { Team } from '@root/payload-cloud-types'

import { payloadCloudToken } from './token'

// TODO: type this using the Stripe module
export interface Invoice {
  created: number
  hosted_invoice_url: string

  id: string
  lines: {
    data: [
      {
        description: string
        id: string
        period: {
          end: number
          start: number
        }
        plan: {
          id: string
        }
        price: {
          id: string
        }
      },
    ]
    url: string
  }
  status: string
  total: number
}

export interface InvoicesResult {
  data: Invoice[]
  has_more: boolean
}

export const fetchInvoices = async (team?: string | Team): Promise<InvoicesResult> => {
  const teamID = typeof team === 'string' ? team : team?.id
  if (!teamID) {
    throw new Error('No team ID provided')
  }

  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const res: InvoicesResult = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/invoices`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      method: 'POST',
    },
  )?.then((r) => r.json())

  return res
}

export const fetchInvoicesClient = async ({
  starting_after,
  team,
}: {
  starting_after?: string
  team?: null | string | Team
}): Promise<InvoicesResult> => {
  const teamID = typeof team === 'string' ? team : team?.id

  if (!teamID) {
    throw new Error('No team ID provided')
  }

  const res: InvoicesResult = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/invoices`,
    {
      body: JSON.stringify({
        starting_after,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  ).then((r) => r.json())

  return res
}
