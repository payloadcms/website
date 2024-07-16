import { RichTextCustomElement } from "@payloadcms/richtext-slate"

export const withLargeBody: RichTextCustomElement['plugins'][0] = incomingEditor => {
  const editor = incomingEditor

  // @ts-expect-error
  const { shouldBreakOutOnEnter } = editor

  // @ts-expect-error
  editor.shouldBreakOutOnEnter = element =>
    element.type === 'large-body' ? true : shouldBreakOutOnEnter(element)

  return editor
}
