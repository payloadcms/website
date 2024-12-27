import {
  $convertFromMarkdownString,
  $createServerBlockNode,
  $isServerBlockNode,
  type DefaultTypedEditorState,
  getEnabledNodes,
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

export const UploadBlockMarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [ServerBlockNode],
  export: (node) => {
    if (!$isServerBlockNode(node)) {
      return null
    }

    const fields = node.getFields()

    if (fields.blockType !== 'upload') {
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
      blockType: 'upload',
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

  headlessEditor.update(
    () => {
      $convertFromMarkdownString(mdx, [
        UploadBlockMarkdownTransformer,
        ...editorConfig.features.markdownTransformers,
      ])
    },
    { discrete: true },
  )

  return {
    editorState: headlessEditor
      .getEditorState()
      .toJSON() as DefaultTypedEditorState<SerializedBlockNode>,
  }
}

export const lexicalToMDX = ({
  editorConfig,
  editorState,
}: {
  editorConfig: SanitizedServerEditorConfig
  editorState: DefaultTypedEditorState<SerializedBlockNode>
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

  return markdown
}
