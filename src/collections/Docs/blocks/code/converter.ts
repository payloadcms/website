import type { BlockJSX } from 'payload'

import { languages } from '../shared'

export const codeConverter: BlockJSX = {
  customEndRegex: {
    optional: true,
    regExp: /[ \t]*```$/,
  },
  customStartRegex: /^[ \t]*```(\w+)?/,
  doNotTrimChildren: true,
  export: ({ fields }) => {
    const isSingleLine = !fields.code.includes('\n') && !fields.language?.length
    if (isSingleLine) {
      return '```' + fields.code + '```'
    }

    return '```' + (fields.language || '') + (fields.code ? '\n' + fields.code : '') + '\n' + '```'
  },
  import: ({ children, closeMatch, openMatch, props }) => {
    // Removed first and last \n from children if present
    if (children.startsWith('\n')) {
      children = children.slice(1)
    }
    if (children.endsWith('\n')) {
      children = children.slice(0, -1)
    }

    const languageMatch = (openMatch ? openMatch[1] : '') ?? ''
    const language = (openMatch ? openMatch[1] : 'plaintext') ?? 'plaintext'

    if (!languages[language]) {
      console.error(`Invalid language "${language}"`, openMatch, children, props)
    }

    const isSingleLineAndComplete =
      !!closeMatch && !children.includes('\n') && openMatch?.input?.trim() !== '```' + language

    if (isSingleLineAndComplete) {
      return {
        code: languageMatch + (children?.length ? children : ''), // No need to add space to children as they are not trimmed
        language: 'plaintext',
      }
    }

    return {
      code: children,
      language,
    }
  },
}
