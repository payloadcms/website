import type { AdapterArguments, RichTextElement, RichTextLeaf } from '@payloadcms/richtext-slate'
// import { slateEditor } from '@payloadcms/richtext-slate'
import type { RichTextField } from 'payload'

import deepMerge from '../../utilities/deepMerge'
import link from '../link'
import elements from './elements'
import leaves from './leaves'

type RichText = (
  overrides?: Partial<
    RichTextField & {
      admin: RichTextField['admin'] & AdapterArguments['admin']
    }
  >,
  additions?: {
    elements?: RichTextElement[]
    leaves?: RichTextLeaf[]
  },
) => RichTextField

const richText: RichText = (
  overrides = {},
  additions = {
    elements: [],
    leaves: [],
  },
): RichTextField => {
  const overridesToMerge = overrides ? { ...overrides } : {}

  return deepMerge<RichTextField, Partial<RichTextField>>(
    {
      name: 'richText',
      type: 'richText',
      required: true,
      // editor: slateEditor({
      //   admin: deepMerge<AdapterArguments['admin'], Partial<AdapterArguments['admin']>>(
      //     {
      //       upload: {
      //         collections: {
      //           media: {
      //             fields: [
      //               {
      //                 name: 'enableLink',
      //                 type: 'checkbox',
      //                 label: 'Enable Link',
      //               },
      //               link({
      //                 appearances: false,
      //                 disableLabel: true,
      //                 overrides: {
      //                   admin: {
      //                     condition: (_, data) => Boolean(data?.enableLink),
      //                   },
      //                 },
      //               }),
      //             ],
      //           },
      //         },
      //       },
      //       elements: [...elements, ...(additions.elements || [])],
      //       leaves: [...leaves, ...(additions.leaves || [])],
      //     },
      //     overrides?.admin,
      //   ),
      // }),
    },
    overridesToMerge,
  )
}

export default richText
