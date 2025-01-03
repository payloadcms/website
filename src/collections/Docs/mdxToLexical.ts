import {
  $convertFromMarkdownString,
  $createServerBlockNode,
  $isServerBlockNode,
  type DefaultTypedEditorState,
  getEnabledNodes,
  objectToFrontmatter,
  type SanitizedServerEditorConfig,
  type SerializedBlockNode,
  ServerBlockNode,
} from '@payloadcms/richtext-lexical'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import {
  $convertToMarkdownString,
  type ElementTransformer,
} from '@payloadcms/richtext-lexical/lexical/markdown'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import { deepCopyObjectSimple } from 'payload'

export const UploadBlockMarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [ServerBlockNode],
  export: (node) => {
    if (!$isServerBlockNode(node)) {
      return null
    }

    const fields = node.getFields()

    if (fields.blockType !== 'Upload') {
      return null
    }

    const altText: string | undefined = fields?.alt
    const caption: any = fields?.caption

    const captionText =
      caption && hasText(caption)
        ? `\n${lexicalToMDX({ editorConfig: cachedServerEditorConfig as any, editorState: caption })}`
        : ''

    if (altText?.length) {
      return `![${altText}](${fields?.src})` + captionText
    } else {
      return `![](${fields?.src})` + captionText
    }
  },
  regExp: /!\[([^[]*)\]\(([^(]+)\)/,
  replace: (textNode, children, match) => {
    const [fullMatch, altText, src] = match

    const textAfterImage = (match as any).input.slice(
      ((match as any).index ?? 0) + fullMatch.length,
    )

    const caption = textAfterImage?.trim()?.length ? textAfterImage?.trim() : undefined

    const uploadBlockNode = $createServerBlockNode({
      alt: altText,
      blockName: '',
      blockType: 'Upload',
      caption: caption?.length
        ? mdxToLexical({ editorConfig: cachedServerEditorConfig as any, mdx: caption }).editorState
        : undefined,
      src,
    })
    textNode.replace(uploadBlockNode)
  },
}

export let cachedServerEditorConfig: null | SanitizedServerEditorConfig = null

export function mdxToLexical({
  editorConfig,
  mdx,
}: {
  editorConfig: SanitizedServerEditorConfig
  mdx: string
}): {
  editorState: DefaultTypedEditorState<SerializedBlockNode>
} {
  cachedServerEditorConfig = editorConfig

  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig,
    }),
  })

  try {
    headlessEditor.update(
      () => {
        try {
          $convertFromMarkdownString(mdx, [
            UploadBlockMarkdownTransformer,
            ...editorConfig.features.markdownTransformers,
          ])
        } catch (e) {
          console.error('Error parsing markdown', mdx)
          throw e
        }
      },
      { discrete: true },
    )
  } catch (e) {
    console.error('Error parsing markdown', mdx)
    throw e
  }

  return {
    editorState: headlessEditor
      .getEditorState()
      .toJSON() as DefaultTypedEditorState<SerializedBlockNode>,
  }
}

export type FrontMatterData = {
  description?: string
  keywords?: string[]
  label?: string
  order?: number
  title?: string
}

export const lexicalToMDX = ({
  editorConfig,
  editorState,
  frontMatterData,
}: {
  editorConfig: SanitizedServerEditorConfig
  editorState: DefaultTypedEditorState<SerializedBlockNode>
  frontMatterData?: FrontMatterData
}): string => {
  cachedServerEditorConfig = editorConfig
  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig,
    }),
  })

  // Convert lexical state to markdown
  // Import editor state into your headless editor
  try {
    headlessEditor.setEditorState(headlessEditor.parseEditorState(editorState)) // This should commit the editor state immediately
  } catch (e) {
    console.error('Error parsing editor state', e)
  }

  // Export to markdown
  let markdown: string = ''
  headlessEditor.getEditorState().read(() => {
    markdown = $convertToMarkdownString([
      UploadBlockMarkdownTransformer,
      ...editorConfig.features.markdownTransformers,
    ])
  })

  if (!frontMatterData) {
    return markdown
  }

  const frontmatterData: FrontMatterData = deepCopyObjectSimple(frontMatterData)

  const frontmatterString = objectToFrontmatter(frontmatterData)

  if (frontmatterString?.length) {
    markdown = frontmatterString + '\n' + markdown
  }

  return markdown
}
