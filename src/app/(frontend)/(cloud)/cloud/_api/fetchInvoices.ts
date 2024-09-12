import type { Team } from '@root/payload-cloud-types.js'
import { payloadCloudToken } from './token.js'

// TODO: type this using the Stripe module
export interface Invoice {
  id: string
  status: string

  created: number
  total: number
  hosted_invoice_url: string
  lines: {
    url: string
    data: [
      {
        id: string
        description: string
        period: {
          start: number
          end: number
        }
        plan: {
          id: string
        }
        price: {
          id: string
        }
      },
    ]
  }
}

export interface InvoicesResult {
  data: Invoice[]
  has_more: boolean
}

export const fetchInvoices = async (team?: Team | string): Promise<InvoicesResult> => {
  const teamID = typeof team === 'string' ? team : team?.id
  if (!teamID) throw new Error('No team ID provided')

  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const res: InvoicesResult = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/invoices`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
    },
  )?.then(r => r.json())

  return res
}

export const fetchInvoicesClient = async ({
  team,
  starting_after,
}: {
  team?: Team | string | null
  starting_after?: string
}): Promise<InvoicesResult> => {
  const teamID = typeof team === 'string' ? team : team?.id

  if (!teamID) throw new Error('No team ID provided')

  const res: InvoicesResult = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/invoices`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        starting_after,
      }),
    },
  ).then(r => r.json())

  return res
}
