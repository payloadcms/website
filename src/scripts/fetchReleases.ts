/* eslint-disable no-console */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

interface GitHubRelease {
  body: null | string
  draft: boolean
  html_url: string
  id: number
  name: null | string
  prerelease: boolean
  published_at: null | string
  tag_name: string
}

/**
 * Fetch releases from the GitHub REST API.
 * Returns up to `limit` releases sorted by most recent first.
 */
export async function fetchGitHubReleases(limit = 20): Promise<GitHubRelease[]> {
  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN
  if (!GITHUB_ACCESS_TOKEN) {
    throw new Error('[fetchReleases] GITHUB_ACCESS_TOKEN is not set. Cannot fetch GitHub releases.')
  }

  const perPage = Math.min(limit, 100)
  const releases: GitHubRelease[] = []
  let page = 1

  while (releases.length < limit) {
    const res = await fetch(
      `https://api.github.com/repos/payloadcms/payload/releases?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      },
    )

    if (!res.ok) {
      throw new Error(`[fetchReleases] GitHub API error: ${res.status} ${res.statusText}`)
    }

    const batch: GitHubRelease[] = await res.json()

    if (batch.length === 0) {
      break
    }

    // Skip drafts and pre-releases
    const published = batch.filter((r) => !r.draft && !r.prerelease && r.published_at)
    releases.push(...published)
    page++

    // If the batch was smaller than perPage, there are no more pages
    if (batch.length < perPage) {
      break
    }
  }

  return releases.slice(0, limit)
}

/**
 * Derive a URL-safe slug from a GitHub tag name.
 * Preserves the leading `v`, dots, and hyphens.
 * Only strips characters that are not word chars, dots, or hyphens.
 */
function tagToSlug(tag: string): string {
  return tag
    .replace(/ /g, '-')
    .replace(/[^\w.-]+/g, '')
    .toLowerCase()
}

/**
 * Map a GitHub release to the Payload release data shape.
 */
function mapGitHubRelease(release: GitHubRelease, authorId: string) {
  return {
    slug: tagToSlug(release.tag_name),
    _status: 'published' as const,
    authors: [authorId],
    content: release.body
      ? [
          {
            blockType: 'blogMarkdown' as const,
            blogMarkdownFields: {
              markdown: release.body,
            },
          },
        ]
      : [],
    githubReleaseId: release.id,
    githubTag: release.tag_name,
    githubUrl: release.html_url,
    importedFromGitHub: true,
    publishedOn: release.published_at || new Date().toISOString(),
    title: release.name || release.tag_name,
  }
}

/**
 * Resolve the "Payload Team" user record.
 * Fails with a clear error if the user cannot be found.
 */
async function resolvePayloadTeamAuthor(payload: Payload): Promise<string> {
  const result = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ firstName: { equals: 'Payload' } }, { lastName: { equals: 'Team' } }],
    },
  })

  if (result.docs.length === 0) {
    throw new Error(
      '[fetchReleases] Could not find a user with firstName="Payload" and lastName="Team". ' +
        'Please create this user in the Users collection before syncing releases.',
    )
  }

  return result.docs[0].id
}

/**
 * Sync GitHub releases into the Payload Releases collection.
 * Idempotent: upserts by githubReleaseId, with githubTag as fallback.
 */
export async function syncReleases(limit = 20): Promise<{ created: number; updated: number }> {
  console.log(`[syncReleases] Starting sync of up to ${limit} releases...`)

  const payload = await getPayload({ config })
  const authorId = await resolvePayloadTeamAuthor(payload)
  const githubReleases = await fetchGitHubReleases(limit)

  console.log(`[syncReleases] Fetched ${githubReleases.length} releases from GitHub`)

  // Fetch all existing releases from Payload to match against
  const existingResult = await payload.find({
    collection: 'releases',
    depth: 0,
    limit: 0,
    overrideAccess: true,
    select: {
      githubReleaseId: true,
      githubTag: true,
    },
  })

  const existingByGitHubId = new Map<number, string>()
  const existingByTag = new Map<string, string>()

  for (const doc of existingResult.docs) {
    if (doc.githubReleaseId) {
      existingByGitHubId.set(doc.githubReleaseId, doc.id)
    }
    if (doc.githubTag) {
      existingByTag.set(doc.githubTag, doc.id)
    }
  }

  let created = 0
  let updated = 0

  for (const release of githubReleases) {
    const data = mapGitHubRelease(release, authorId)

    // Primary lookup by githubReleaseId, fallback to githubTag
    const existingDocId = existingByGitHubId.get(release.id) || existingByTag.get(release.tag_name)

    try {
      if (existingDocId) {
        await payload.update({
          id: existingDocId,
          collection: 'releases',
          data,
          draft: false,
          overrideAccess: true,
        })
        updated++
        console.log(`[syncReleases] Updated: ${data.title} (${release.tag_name})`)
      } else {
        await payload.create({
          collection: 'releases',
          data,
          draft: false,
          overrideAccess: true,
        })
        created++
        console.log(`[syncReleases] Created: ${data.title} (${release.tag_name})`)
      }
    } catch (error) {
      console.error(
        `[syncReleases] Failed to process release "${data.title}" (${release.tag_name}):`,
        error,
      )
    }
  }

  console.log(
    `[syncReleases] Sync complete. Created: ${created}, Updated: ${updated}, Total processed: ${githubReleases.length}`,
  )

  return { created, updated }
}
