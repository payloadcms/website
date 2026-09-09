import type { BlockJSX } from 'payload'

import { languages } from '../shared'

const languageAliases: Record<string, keyof typeof languages> = {
  md: 'markdown',
  txt: 'text',
}

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
    const requestedLanguage = (openMatch ? openMatch[1] : 'plaintext') ?? 'plaintext'
    const language =
      requestedLanguage in languages
        ? (requestedLanguage as keyof typeof languages)
        : (languageAliases[requestedLanguage] ?? 'plaintext')

    if (!(requestedLanguage in languages) && !languageAliases[requestedLanguage]) {
      console.warn(`Unsupported language "${requestedLanguage}", using plaintext`, props)
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
