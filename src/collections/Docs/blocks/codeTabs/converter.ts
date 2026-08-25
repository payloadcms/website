import type { BlockJSX } from 'payload'

import { languages } from '../shared'

type CodeTab = {
  code: string
  label: string
  language: string
}

const codeFenceStart = /^\s*(`{3,}|~{3,})([\w-]+)?\s+label=("(?:\\.|[^"\\])*")\s*$/

const getCodeFence = (code: string): string => {
  let longestFence = 2

  for (const line of code.split('\n')) {
    const match = line.match(/^\s*(`+)/)
    if (match) {
      longestFence = Math.max(longestFence, match[1].length)
    }
  }

  return '`'.repeat(longestFence + 1)
}

export const codeTabsToMarkdown = (tabs: CodeTab[]): string =>
  tabs
    .map(({ code, label, language }) => {
      const fence = getCodeFence(code)
      return `${fence}${language || 'plaintext'} label=${JSON.stringify(label)}\n${code}\n${fence}`
    })
    .join('\n\n')

export const markdownToCodeTabs = (markdown: string): CodeTab[] | false => {
  const lines = markdown.replace(/^\n/, '').replace(/\n$/, '').split('\n')
  const tabs: CodeTab[] = []
  let lineIndex = 0

  while (lineIndex < lines.length) {
    if (!lines[lineIndex].trim()) {
      lineIndex++
      continue
    }

    const startMatch = lines[lineIndex].match(codeFenceStart)
    if (!startMatch) {
      return false
    }

    const fence = startMatch[1]
    const language = startMatch[2] || 'plaintext'
    let label: string

    try {
      label = JSON.parse(startMatch[3]) as string
    } catch {
      return false
    }
    const codeLines: string[] = []
    const closingFence = new RegExp(`^\\s*${fence[0]}{${fence.length},}\\s*$`)

    lineIndex++
    while (lineIndex < lines.length && !closingFence.test(lines[lineIndex])) {
      codeLines.push(lines[lineIndex])
      lineIndex++
    }

    if (lineIndex === lines.length) {
      return false
    }

    if (!languages[language as keyof typeof languages]) {
      console.error(`Invalid language "${language}" in CodeTabs block`)
    }

    if (!label) {
      return false
    }

    tabs.push({
      code: codeLines.join('\n'),
      label,
      language,
    })
    lineIndex++
  }

  return tabs.length >= 2 ? tabs : false
}

export const codeTabsConverter: BlockJSX = {
  doNotTrimChildren: true,
  export: ({ fields }) => ({
    children: codeTabsToMarkdown(fields.tabs ?? []),
  }),
  import: ({ children }) => {
    const tabs = markdownToCodeTabs(children)

    if (!tabs) {
      return false
    }

    return { tabs }
  },
}
