import { v3ComponentDocumentation } from '../../../preview-runtimes/v3/src/examples/documentation'
import { v4ComponentExamples } from '../../components/RichText/ComponentPreview/examples/v4'

type DocsVersion = 'v3' | 'v4'

type PreviewDocumentation = Record<
  string,
  Record<
    string,
    {
      code: string
      design?: {
        code: string
        description: string
        variables: Array<{ description: string; name: string }>
      }
    }
  >
>

const previewDocumentation: Record<DocsVersion, PreviewDocumentation> = {
  v3: v3ComponentDocumentation,
  v4: v4ComponentExamples,
}

function getStringAttribute(source: string, name: string): string | undefined {
  const match = source.match(new RegExp(`\\b${name}=(?:"([^"]+)"|'([^']+)')`))
  return match?.[1] || match?.[2]
}

function collectElement(lines: string[], startIndex: number, closing: string): [string, number] {
  let element = lines[startIndex]
  let index = startIndex

  while (!element.includes(closing) && index + 1 < lines.length) {
    index += 1
    element += `\n${lines[index]}`
  }

  return [element, index]
}

function renderComponentPreview({
  component,
  example,
  version,
}: {
  component: string
  example: string
  version: DocsVersion
}): string {
  const documentation = previewDocumentation[version][component]?.[example]

  if (!documentation) {
    throw new Error(`Missing ${version} ComponentPreview documentation for ${component}.${example}`)
  }

  let output = `**Implementation**\n\n\`\`\`tsx\n${documentation.code}\n\`\`\``

  if (documentation.design) {
    output += `\n\n**Styling**\n\n${documentation.design.description}\n\n\`\`\`css\n${documentation.design.code}\n\`\`\``

    if (documentation.design.variables.length > 0) {
      output += `\n\n${documentation.design.variables
        .map((variable) => `- \`${variable.name}\`: ${variable.description}`)
        .join('\n')}`
    }
  }

  return output
}

function normalizeDocsLinks(source: string, version: DocsVersion, currentTopic?: string): string {
  return source.replace(/(\]\()([^)]+)(\))/g, (_match, opening, url, closing) => {
    return `${opening}${normalizeDocsURL(url, version, currentTopic)}${closing}`
  })
}

function normalizeDocsURL(url: string, version: DocsVersion, currentTopic?: string): string {
  const crossTopicMatch = url.match(
    /^(?:(?:https:\/\/payloadcms\.com)?\/docs\/|\.\.\/)([^/#]+)\/([^/#]+)(#[^#]+)?$/,
  )
  if (crossTopicMatch) {
    const [, topic, doc, hash = ''] = crossTopicMatch
    return `/docs/${version}/${topic}/${doc}.md${hash}`
  }

  const sameTopicMatch = currentTopic ? url.match(/^\.\/([^/#.]+)(#[^#]+)?$/) : undefined
  if (sameTopicMatch) {
    const [, doc, hash = ''] = sameTopicMatch
    return `/docs/${version}/${currentTopic}/${doc}.md${hash}`
  }

  return url
}

function renderBanner(source: string): string {
  const type = getStringAttribute(source, 'type') || 'note'
  const label = type === 'info' ? 'Note' : `${type.charAt(0).toUpperCase()}${type.slice(1)}`
  const body = source
    .replace(/^\s*<Banner[^>]*>\s*/, '')
    .replace(/\s*<\/Banner>\s*$/, '')
    .split('\n')
    .map((line) => line.replace(/^ {2}/, ''))

  const firstContentLine = body.find((line) => line.trim())
  const alreadyLabeled = /^\*\*[^*]+:\*\*/.test(firstContentLine?.trim() || '')
  const heading = alreadyLabeled ? [] : [`> **${label}**`, '>']

  return [...heading, ...body.map((line) => (line ? `> ${line}` : '>'))].join('\n')
}

function renderCardGroup(source: string, version: DocsVersion): string {
  const cards = [...source.matchAll(/<Card\b[\s\S]*?\/>/g)]

  return cards
    .map((card) => {
      const title = getStringAttribute(card[0], 'title') || 'Documentation'
      const description = getStringAttribute(card[0], 'description')
      const link = getStringAttribute(card[0], 'link')
      const label = link ? `[${title}](${normalizeDocsURL(link, version)})` : title
      return `- ${label}${description ? `: ${description}` : ''}`
    })
    .join('\n')
}

function renderImage(source: string): string {
  const alt = getStringAttribute(source, 'alt') || 'Documentation image'
  const caption = getStringAttribute(source, 'caption')
  const src =
    getStringAttribute(source, 'srcLight') ||
    getStringAttribute(source, 'src') ||
    getStringAttribute(source, 'url')

  if (!src) {
    return caption || alt
  }
  return `![${alt}](${src})${caption ? `\n\n_${caption}_` : ''}`
}

function renderYouTube(source: string): string {
  const id = getStringAttribute(source, 'id')
  const title = getStringAttribute(source, 'title') || 'Payload video'
  return id ? `[Video: ${title}](https://www.youtube.com/watch?v=${id})` : `Video: ${title}`
}

export function normalizeMDXForLLMs(
  content: string,
  version: DocsVersion,
  currentTopic?: string,
): string {
  const lines = content.split('\n')
  const output: string[] = []
  let fence: '```' | '~~~' | undefined

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const fenceMatch = line.match(/^\s*(```|~~~)/)

    if (fenceMatch) {
      const marker = fenceMatch[1] as '```' | '~~~'
      fence = fence === marker ? undefined : fence || marker
      output.push(line)
      continue
    }

    if (fence) {
      output.push(line)
      continue
    }

    const trimmedLine = line.trimStart()

    if (trimmedLine.startsWith('<ComponentPreview')) {
      const [componentPreview, endIndex] = collectElement(lines, index, '/>')
      index = endIndex

      const component = getStringAttribute(componentPreview, 'component')
      const example = getStringAttribute(componentPreview, 'example')

      if (!component || !example || !componentPreview.includes('/>')) {
        throw new Error('ComponentPreview requires string component and example attributes')
      }

      output.push(renderComponentPreview({ component, example, version }))
      continue
    }

    if (trimmedLine.startsWith('<Banner')) {
      const [banner, endIndex] = collectElement(lines, index, '</Banner>')
      index = endIndex

      if (!banner.includes('</Banner>')) {
        throw new Error('Banner is missing its closing tag')
      }

      output.push(normalizeDocsLinks(renderBanner(banner), version, currentTopic))
      continue
    }

    if (trimmedLine.startsWith('<CardGroup')) {
      const [cardGroup, endIndex] = collectElement(lines, index, '</CardGroup>')
      index = endIndex

      if (!cardGroup.includes('</CardGroup>')) {
        throw new Error('CardGroup is missing its closing tag')
      }

      output.push(renderCardGroup(cardGroup, version))
      continue
    }

    if (trimmedLine.startsWith('<LightDarkImage') || trimmedLine.startsWith('<PayloadMedia')) {
      const [image, endIndex] = collectElement(lines, index, '/>')
      index = endIndex
      output.push(renderImage(image))
      continue
    }

    if (trimmedLine.startsWith('<YouTube')) {
      const [video, endIndex] = collectElement(lines, index, '/>')
      index = endIndex
      output.push(renderYouTube(video))
      continue
    }

    output.push(normalizeDocsLinks(line, version, currentTopic))
  }

  return `${output.join('\n').trim()}\n`
}
