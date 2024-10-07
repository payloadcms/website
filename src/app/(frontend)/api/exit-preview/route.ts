import { draftMode } from 'next/headers'

export async function GET(): Promise<Response> {
  const parsedDraftMode = await draftMode()
  parsedDraftMode.disable()
  return new Response('Draft mode is disabled')
}
