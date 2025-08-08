import type { GithubAPIResponse, ParsedDoc, Topic, TopicGroup } from '@root/collections/Docs/types'

import { topicOrder } from '@root/collections/Docs/topicOrder'
import { decodeBase64 } from '@root/utilities/decode-base-64'
import { config } from 'dotenv'
import { writeFileSync } from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

config()

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'
const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

const fetchDocsFromTopic = async ({ topicSlug }: { topicSlug: string }) => {
  try {
    const docs = await fetch(`${githubAPI}/contents/docs/${topicSlug}`, {
      headers,
    }).then((res) => res.json())

    if (docs && Array.isArray(docs)) {
      return docs.map((doc) => doc.name)
    } else if (docs && typeof docs === 'object' && 'message' in docs) {
      console.error(`Error fetching ${topicSlug}. Reason: ${docs.message}`)
    }
    return []
  } catch (_e) {
    return []
  }
}

async function getDocMatter({
  docFilename,
  topicSlug,
}: {
  docFilename: string
  topicSlug: string
}) {
  const json: GithubAPIResponse = await fetch(
    `${githubAPI}/contents/docs/${topicSlug}/${docFilename}`,
    {
      headers,
    },
  ).then((res) => res.json())

  const parsedDoc = matter(decodeBase64(json.content))
  parsedDoc.content = parsedDoc.content
    .replace(/\(\/docs\//g, '(../')
    .replace(/"\/docs\//g, '"../')
    .replace(/https:\/\/payloadcms.com\/docs\//g, '../')
  return parsedDoc
}

async function generateLLMs() {
  console.log('Generating LLMs...')
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.error('GITHUB_ACCESS_TOKEN is not set. Please set it in your environment variables.')
    return
  }

  const topics: TopicGroup[] = (
    await Promise.all(
      topicOrder.v3.map(
        async ({ groupLabel, topics: topicsGroup }) => ({
          groupLabel,
          topics: (
            await Promise.all(
              topicsGroup
                .map(async (key) => {
                  const topicSlug = key.toLowerCase()
                  const filenames = await fetchDocsFromTopic({ topicSlug })

                  if (filenames.length === 0) {
                    return null
                  }

                  const parsedDocs: ParsedDoc[] = (
                    await Promise.all(
                      filenames
                        .map(async (docFilename) => {
                          const docMatter = await getDocMatter({ docFilename, topicSlug })

                          if (!docMatter) {
                            return null
                          }

                          return {
                            slug: docFilename.replace('.mdx', ''),
                            content: docMatter.content,
                            desc: docMatter.data.desc || docMatter.data.description || '',
                            keywords: docMatter.data.keywords || '',
                            label: docMatter.data.label,
                            order: docMatter.data.order,
                            title: docMatter.data.title,
                          }
                        })
                        .filter(Boolean),
                    )
                  ).filter(Boolean) as ParsedDoc[]

                  return {
                    slug: topicSlug,
                    docs: parsedDocs.sort((a, b) => a.order - b.order),
                    label: key,
                  } as Topic
                })
                .filter(Boolean),
            )
          ).filter(Boolean),
        }),
        [],
      ),
    )
  ).filter(Boolean) as TopicGroup[]

  const output = topics.map((group) => ({
    groupLabel: group.groupLabel,
    topics: group.topics.map((topic) => ({
      slug: topic.slug,
      docs: topic.docs.map((doc) => ({
        slug: doc.slug,
        content: doc.content,
        label: doc.label,
        order: doc.order,
        title: doc.title,
      })),
      label: topic.label,
    })),
  }))

  let outputStr = '# Payload\n\n'
  let fullOutputStr = `# Payload Documentation\n\n`

  for (const group of output) {
    outputStr += `## ${group.groupLabel}\n\n`
    for (const topic of group.topics) {
      outputStr += `### ${topic.label.replace('-', ' ')}\n`
      for (const doc of topic.docs) {
        outputStr += `- [${doc.title}](https://payloadcms.com/docs/${topic.slug}/${doc.slug})\n`
        fullOutputStr += `#${doc.title}\nSource: https://payloadcms.com/docs/${topic.slug}/${doc.slug}\n\n${doc.content}\n\n`
      }
      outputStr += '\n'
    }
  }

  const filePath = join(process.cwd(), 'public', 'llms.txt')
  const fullFilePath = join(process.cwd(), 'public', 'llms-full.txt')
  writeFileSync(filePath, outputStr)
  writeFileSync(fullFilePath, fullOutputStr)
  console.log(`Wrote llms.txt to ${filePath}`)
  console.log(`Wrote llms-full.txt to ${fullFilePath}`)
}

void generateLLMs()
