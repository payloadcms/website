import type { Block, Field, GlobalConfig } from 'payload'

import { isAdmin } from '@root/access/isAdmin'
import linkGroup from '@root/fields/linkGroup'
import { revalidatePath } from 'next/cache'

const tabBlock: (slug: string, fields: Field[]) => Block = (slug, fields) => {
  return {
    slug,
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Tab Label',
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
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Get started with Payload',
              label: 'Page Heading',
            },
            {
              name: 'tabs',
              type: 'blocks',
              blocks: [richTextBlock],
              labels: {
                plural: 'Tabs',
                singular: 'Tab',
              },
            },
          ],
          label: 'Tabs',
        },
        {
          fields: [
            {
              name: 'sidebar',
              type: 'richText',
              admin: {
                position: 'sidebar',
              },
              label: 'Sidebar Content',
            },
            linkGroup({
              appearances: false,
              overrides: {
                name: 'sidebarLinks',
              },
            }),
          ],
          label: 'Sidebar',
        },
      ],
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
