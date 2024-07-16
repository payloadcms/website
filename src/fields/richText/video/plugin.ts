import { RichTextCustomElement } from "@payloadcms/richtext-slate"

const withVideo: RichTextCustomElement['plugins'][0] = incomingEditor => {
  const editor = incomingEditor
  const { isVoid } = editor

  // @ts-expect-error
  editor.isVoid = element => (element.type === 'video' ? true : isVoid(element))

  return editor
}

export default withVideo
