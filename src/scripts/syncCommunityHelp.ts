import { PayloadHandler } from 'payload'
import fetchDiscord from './fetchDiscord'
import fetchGitHub from './fetchGitHub'
import syncToAlgolia from './syncToAlgolia'

const syncCommunityHelp: PayloadHandler = async req => {
  const { payload } = req

  await fetchDiscord(payload)
  await fetchGitHub(payload)
  await syncToAlgolia(payload)

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

export default syncCommunityHelp
