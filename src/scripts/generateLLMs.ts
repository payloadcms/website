import { writeFileSync } from 'fs'
import { join } from 'path'

import { fetchDocs } from './fetchDocs'

async function generateLLMs() {
  console.log('Generating LLMs...')
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.error('GITHUB_ACCESS_TOKEN is not set. Please set it in your environment variables.')
    return
  }

  const topics = await fetchDocs({ ref: 'main', version: 'v3' })

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
