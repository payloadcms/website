'use client'
import {
  createClientFeature,
  getSelectedNode,
  toolbarTextDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { $getSelection, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'
import { $setBlocksType } from '@payloadcms/richtext-lexical/lexical/selection'
import { $findMatchingParent } from '@payloadcms/richtext-lexical/lexical/utils'
import { LargeBodyIcon } from '@root/fields/richText/features/largeBody/client/icon'
import {
  $createLargeBodyNode,
  $isLargeBodyNode,
  LargeBodyNode,
} from '@root/fields/richText/features/largeBody/LargeBodyNode'

import './styles.scss'

export const LargeBodyFeatureClient = createClientFeature({
  nodes: [LargeBodyNode],
  slashMenu: {
    groups: [
      {
        items: [
          {
            Icon: LargeBodyIcon,
            key: 'largeBody',
            keywords: ['largeBody', 'body', 'lb'],
            label: 'Large Body',
            onSelect: () => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createLargeBodyNode())
              }
            },
          },
        ],
        key: 'Basic',
        label: 'Basic',
      },
    ],
  },
  toolbarInline: {
    groups: [
      toolbarTextDropdownGroupWithItems([
        {
          ChildComponent: LargeBodyIcon,
          isActive: ({ selection }) => {
            if ($isRangeSelection(selection)) {
              const selectedNode = getSelectedNode(selection)
              const largeBodyParent = $findMatchingParent(selectedNode, $isLargeBodyNode)
              return largeBodyParent != null
            }
            return false
          },
          key: 'largeBody',
          label: `Large Body`,
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createLargeBodyNode())
              }
            })
          },
          order: 290,
        },
      ]),
    ],
  },
})
