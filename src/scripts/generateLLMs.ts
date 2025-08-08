import { writeFile } from 'fs/promises'
import { join } from 'path'

import { fetchDocs } from './fetchDocs'

async function generateLLMs() {
  console.log('Generating LLMs...')
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.error('GITHUB_ACCESS_TOKEN is not set. Please set it in your environment variables.')
    return
  }

  const output = await fetchDocs({ ref: 'main', version: 'v3' })

  let outputStr = '# Payload\n\n'
  let fullOutputStr = `# Payload Documentation\n\n`

  for (const group of output) {
    outputStr += `## ${group.groupLabel}\n\n`
    for (const topic of group.topics) {
      outputStr += `### ${topic.label.replace('-', ' ')}\n\n`
      for (const doc of topic.docs) {
        outputStr += `- [${doc.title}](https://payloadcms.com/docs/${topic.slug}/${doc.slug})\n\n`
        fullOutputStr += `# ${doc.title}\n\nSource: https://payloadcms.com/docs/${topic.slug}/${doc.slug}\n\n${doc.content}\n\n`
      }
      outputStr += '\n'
    }
  }

  const filePath = join(process.cwd(), 'public', 'llms.txt')
  const fullFilePath = join(process.cwd(), 'public', 'llms-full.txt')
  await Promise.all([writeFile(filePath, outputStr), writeFile(fullFilePath, fullOutputStr)])
  console.log(`Wrote llms.txt to ${filePath}`)
  console.log(`Wrote llms-full.txt to ${fullFilePath}`)
}

void generateLLMs()
