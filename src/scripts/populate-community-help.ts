import config from '@payload-config'
import { getPayload } from 'payload'

import { fetchDiscordThreads } from './fetch-discord'
import { fetchGithubDiscussions } from './fetch-github'

// eslint-disable-next-line
require('dotenv').config()

const { MONGODB_URI, PAYLOAD_SECRET } = process.env

const populateCommunityHelp = async (): Promise<void> => {
  const payload = await getPayload({ config })

  try {
    await Promise.all([fetchDiscordThreads(payload), fetchGithubDiscussions(payload)])
  } catch (error: unknown) {
    payload.logger.error({ error })
    process.exit(1)
  }

  payload.logger.info('Done!')
  process.exit(0)
}

void populateCommunityHelp()
