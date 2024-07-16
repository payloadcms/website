'use client'

import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { EmbedNode, OPEN_EMBED_DRAWER_COMMAND } from './nodes/EmbedNode'
import { EmbedPlugin } from './plugins'
import { EmbedIcon } from './icons/EmbedIcon'

export const EmbedFeatureClient = createClientFeature({
  plugins: [
    {
      Component: EmbedPlugin,
      position: 'normal',
    },
  ],
  nodes: [EmbedNode],
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          key: 'embed',
          ChildComponent: EmbedIcon,
          label: 'Embed',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_EMBED_DRAWER_COMMAND, {})
          },
        },
      ]),
    ],
  },
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          key: 'embed',
          label: 'Embed',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_EMBED_DRAWER_COMMAND, {})
          },
          keywords: ['embed'],
          Icon: EmbedIcon,
        },
      ]),
    ],
  },
})
