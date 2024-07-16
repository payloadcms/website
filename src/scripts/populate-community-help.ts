import payload from 'payload'

import { fetchDiscordThreads } from './fetch-discord'
import { fetchGithubDiscussions } from './fetch-github'

// eslint-disable-next-line
require('dotenv').config()

const { PAYLOAD_SECRET, MONGODB_URI } = process.env

const populateCommunityHelp = async (): Promise<void> => {
  const payloadInstance = await payload.init({
    secret: PAYLOAD_SECRET,
    local: true,
  })

  try {
    await Promise.all([
      fetchDiscordThreads(payloadInstance),
      fetchGithubDiscussions(payloadInstance),
    ])
  } catch (error: unknown) {
    payload.logger.error({ error })
    process.exit(1)
  }

  payload.logger.info('Done!')
  process.exit(0)
}

populateCommunityHelp()
