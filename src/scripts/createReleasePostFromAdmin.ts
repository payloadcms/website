import type { PayloadHandler } from 'payload'

import { buildReleasePostData } from './buildReleasePostData'

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/payloadcms/payload/releases'

const createReleasePostFromAdmin: PayloadHandler = async (req) => {
  try {
    if (!req.user?.roles?.includes('admin')) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { version: rawVersion } = ((await req.json?.()) ?? {}) as { version?: string }
    const version = rawVersion ? (rawVersion.startsWith('v') ? rawVersion : `v${rawVersion}`) : undefined

    const githubUrl = version
      ? `${GITHUB_RELEASES_URL}/tags/${version}`
      : `${GITHUB_RELEASES_URL}/latest`

    const githubRes = await fetch(githubUrl)
    if (!githubRes.ok) {
      const msg = version
        ? `Release ${version} not found on GitHub`
        : 'Could not fetch latest release from GitHub'
      return new Response(msg, { status: 400 })
    }

    const release = (await githubRes.json()) as { body: string; tag_name: string }

    const data = await buildReleasePostData({
      body: release.body,
      payload: req.payload,
      version: release.tag_name,
    })

    const post = await req.payload.create({ collection: 'posts', data, draft: true })

    return new Response(JSON.stringify({ id: post.id }), { status: 201 })
  } catch (error: unknown) {
    req.payload.logger.error({ err: error, msg: 'Failed to create release post from admin' })
    return new Response((error as Error).message || 'Failed to create release post', {
      status: 500,
    })
  }
}

export default createReleasePostFromAdmin
