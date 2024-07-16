import { RichTextCustomElement } from "@payloadcms/richtext-slate"

const withLargeBody: RichTextCustomElement['plugins'][0] = incomingEditor => {
  const editor = incomingEditor

  // @ts-expect-error
  const { shouldBreakOutOnEnter } = editor

  // @ts-expect-error
  editor.shouldBreakOutOnEnter = element =>
    element.type === 'label' ? true : shouldBreakOutOnEnter(element)

  return editor
}

export default withLargeBody
