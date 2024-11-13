import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import { GlobalConfig, Block, Field } from 'payload'

const tabBlock: (slug: string, fields: Field[]) => Block = (slug, fields) => {
  return {
    slug,
    fields: [
      {
        name: 'label',
        label: 'Tab Label',
        type: 'text',
        required: true,
      },
      ...fields,
    ],
  }
}
const richTextBlock: Block = tabBlock('richTextBlock', [
  {
    name: 'content',
    type: 'richText',
    required: true,
  },
])
export const GetStarted: GlobalConfig = {
  slug: 'get-started',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Page Heading',
      defaultValue: 'Get started with Payload',
    },
    {
      name: 'tabs',
      type: 'blocks',
      labels: {
        singular: 'Tab',
        plural: 'Tabs',
      },
      blocks: [richTextBlock],
    },
    {
      name: 'sidebar',
      type: 'richText',
      label: 'Sidebar Content',
      admin: {
        position: 'sidebar',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
      }),
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/get-started')
        console.log('Revalidated /get-started')
      },
    ],
  },
}
