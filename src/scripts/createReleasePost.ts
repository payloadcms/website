import type { PayloadHandler } from 'payload'

import { buildReleasePostData } from './buildReleasePostData'

const createReleasePost: PayloadHandler = async (req) => {
  try {
    const secret = req.headers.get('x-release-secret')
    if (!process.env.PAYLOAD_RELEASE_SECRET || secret !== process.env.PAYLOAD_RELEASE_SECRET) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { body, version } = (await req.json?.()) as { body: string; version: string }
    if (!version || !body) {
      return new Response('Missing version or body', { status: 400 })
    }

    const data = await buildReleasePostData({ body, payload: req.payload, version })
    const post = await req.payload.create({ collection: 'posts', data, draft: true })

    return new Response(JSON.stringify({ id: post.id }), { status: 201 })
  } catch (error: unknown) {
    req.payload.logger.error({ err: error, msg: 'Failed to create release post' })
    return new Response((error as Error).message || 'Failed to create release post', {
      status: 500,
    })
  }
}

export default createReleasePost
