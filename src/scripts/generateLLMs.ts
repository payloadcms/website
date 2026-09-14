/* eslint-disable no-console */
import type { ParsedDoc, TopicGroup } from '@root/collections/Docs/types'

import { mkdir, rm, writeFile } from 'fs/promises'
import { dirname, join } from 'path'

import { fetchDocs } from './fetchDocs'
import { normalizeMDXForLLMs } from './llms/normalizeMDX'

type DocsVersion = 'v3' | 'v4'

type GeneratedDoc = {
  markdownPath: string
  sourceURL: string
} & ParsedDoc

type GeneratedTopicGroup = {
  topics: Array<
    {
      docs: GeneratedDoc[]
    } & Omit<TopicGroup['topics'][number], 'docs'>
  >
} & Omit<TopicGroup, 'topics'>

const origin = 'https://payloadcms.com'
const publicDirectory = join(process.cwd(), 'public')
const convertedMDXElements = [
  'Banner',
  'CardGroup',
  'ComponentPreview',
  'LightDarkImage',
  'PayloadMedia',
  'YouTube',
]

const versions: Array<{
  branch: string
  label: string
  status: string
  version: DocsVersion
}> = [
  {
    branch: '3.x',
    label: 'Payload 3.x documentation',
    status: 'Current stable documentation. Use this for Payload 3.x projects.',
    version: 'v3',
  },
  {
    branch: 'main',
    label: 'Payload 4.x documentation',
    status: 'Beta documentation. Use this only for Payload 4.x projects.',
    version: 'v4',
  },
]

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function versionedPagePath(version: DocsVersion, topic: string, slug: string): string {
  return `/docs/${version}/${topic}/${slug}.md`
}

function assertNoUnresolvedElements(content: string, path: string): void {
  let fence: '```' | '~~~' | undefined

  for (const line of content.split('\n')) {
    const marker = line.match(/^\s*(```|~~~)/)?.[1] as '```' | '~~~' | undefined
    if (marker) {
      fence = fence === marker ? undefined : fence || marker
      continue
    }

    if (!fence) {
      const unresolved = convertedMDXElements.find((element) => line.includes(`<${element}`))
      if (unresolved) {
        throw new Error(`Unresolved ${unresolved} element in ${path}`)
      }

      if (/\]\((?:\.\.?\/|\/docs\/(?!v[34]\/))/.test(line)) {
        console.warn(`Unversioned documentation link in ${path}: ${line.trim()}`)
      }
    }
  }
}

function buildDocumentationIndex({
  groupHeading,
  groups,
  topicHeading,
}: {
  groupHeading: string
  groups: GeneratedTopicGroup[]
  topicHeading: string
}): string {
  let output = ''
  for (const group of groups) {
    output += `${groupHeading} ${group.groupLabel}\n\n`
    for (const topic of group.topics) {
      output += `${topicHeading} ${topic.label.replace(/-/g, ' ')}\n\n`
      for (const doc of topic.docs) {
        const description = oneLine(doc.desc)
        output += `- [${doc.title}](${origin}${doc.markdownPath})${description ? `: ${description}` : ''}\n`
      }
      output += '\n'
    }
  }

  return output
}

function buildVersionIndex(groups: GeneratedTopicGroup[], version: DocsVersion): string {
  const versionNumber = version === 'v3' ? '3.x' : '4.x'
  let output = `# Payload ${versionNumber} Documentation\n\n`
  output += `> Official documentation for Payload ${versionNumber}. Use these pages only when the project's Payload major version matches ${versionNumber}.\n\n`
  output += buildDocumentationIndex({ groupHeading: '##', groups, topicHeading: '###' })
  return output
}

function buildFullDocumentation(groups: GeneratedTopicGroup[], version: DocsVersion): string {
  const versionNumber = version === 'v3' ? '3.x' : '4.x'
  let output = `# Payload ${versionNumber} Documentation\n\n`
  output += `> Complete official documentation for Payload ${versionNumber}. Do not mix APIs or examples from another major version.\n\n`

  for (const group of groups) {
    for (const topic of group.topics) {
      for (const doc of topic.docs) {
        output += `# ${doc.title}\n\nSource: ${doc.sourceURL}\n\n${doc.content.trim()}\n\n`
      }
    }
  }

  return output
}

async function writeTextFile(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content)
}

async function generateVersion({
  branch,
  source,
  version,
}: {
  branch: string
  source: 'github' | 'local'
  version: DocsVersion
}): Promise<{
  full: string
  groups: GeneratedTopicGroup[]
  index: string
}> {
  const fetchedGroups = await fetchDocs({
    ref: source === 'local' ? version : branch,
    source,
    version,
  })
  const groups: GeneratedTopicGroup[] = fetchedGroups.map((group) => ({
    ...group,
    topics: group.topics.map((topic) => ({
      ...topic,
      docs: topic.docs.map((doc) => {
        const markdownPath = versionedPagePath(version, topic.slug, doc.slug)
        const sourceURL = `${origin}${
          version === 'v3' ? '/docs' : '/docs/beta'
        }/${topic.slug}/${doc.slug}`
        const content = normalizeMDXForLLMs(doc.content, version, topic.slug)

        assertNoUnresolvedElements(content, markdownPath)

        return {
          ...doc,
          content,
          markdownPath,
          sourceURL,
        }
      }),
    })),
  }))

  const index = buildVersionIndex(groups, version)
  const full = buildFullDocumentation(groups, version)
  const versionDirectory = join(publicDirectory, 'docs', version)

  await rm(versionDirectory, { force: true, recursive: true })
  await Promise.all([
    writeTextFile(join(versionDirectory, 'llms.txt'), index),
    writeTextFile(join(versionDirectory, 'llms-full.txt'), full),
    ...groups.flatMap((group) =>
      group.topics.flatMap((topic) =>
        topic.docs.map((doc) =>
          writeTextFile(
            join(publicDirectory, doc.markdownPath),
            `# ${doc.title}\n\nSource: ${doc.sourceURL}\n\n${doc.content}`,
          ),
        ),
      ),
    ),
  ])

  return { full, groups, index }
}

function buildRootIndex(stableGroups: GeneratedTopicGroup[]): string {
  let output = '# Payload Documentation\n\n'
  output +=
    '> Official Payload documentation, organized by major version. Match the documentation version to the installed `payload` and `@payloadcms/ui` major version.\n\n'
  output += '## Documentation versions\n\n'

  for (const item of versions) {
    output += `- [${item.label}](${origin}/docs/${item.version}/llms.txt): ${item.status}\n`
  }

  output += '\n## Complete documentation\n\n'
  output += `- [Payload 3.x complete documentation](${origin}/docs/v3/llms-full.txt): All stable 3.x documentation in one file.\n`
  output += `- [Payload 4.x complete documentation](${origin}/docs/v4/llms-full.txt): All 4.x documentation in one file.\n`

  output += '\n## Current stable documentation\n\n'
  output += buildDocumentationIndex({
    groupHeading: '###',
    groups: stableGroups,
    topicHeading: '####',
  })

  return output
}

async function generateLLMs() {
  console.log('Generating versioned LLM documentation...')
  const source = process.env.LLMS_DOCS_SOURCE === 'local' ? 'local' : 'github'

  if (source === 'github' && !process.env.GITHUB_ACCESS_TOKEN) {
    console.error('GITHUB_ACCESS_TOKEN is not set. Please set it in your environment variables.')
    return
  }

  const generated = new Map<DocsVersion, Awaited<ReturnType<typeof generateVersion>>>()

  // fetchDocs currently uses request-scoped module state, so versions are intentionally generated in sequence.
  for (const item of versions) {
    generated.set(item.version, await generateVersion({ ...item, source }))
  }

  const stable = generated.get('v3')
  if (!stable) {
    throw new Error('Payload v3 documentation was not generated')
  }

  await Promise.all([
    writeTextFile(join(publicDirectory, 'llms.txt'), buildRootIndex(stable.groups)),
    // Keep the established root URL as a compatibility alias for the current stable major.
    writeTextFile(join(publicDirectory, 'llms-full.txt'), stable.full),
  ])

  for (const item of versions) {
    const result = generated.get(item.version)
    const docCount =
      result?.groups.reduce(
        (count, group) =>
          count + group.topics.reduce((topicCount, topic) => topicCount + topic.docs.length, 0),
        0,
      ) || 0
    console.log(`Wrote ${item.version} LLM documentation (${docCount} pages)`)
  }
}

// @ts-expect-error - this script is executed directly by Payload's TypeScript runner
await generateLLMs()
