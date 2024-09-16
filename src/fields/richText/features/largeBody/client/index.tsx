'use client'
import { $setBlocksType } from '@lexical/selection'
import { $findMatchingParent } from '@lexical/utils'
import {
  createClientFeature,
  getSelectedNode,
  toolbarTextDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import {
  $createLargeBodyNode,
  $isLargeBodyNode,
  LargeBodyNode,
} from '@root/fields/richText/features/largeBody/LargeBodyNode'
import { LargeBodyIcon } from '@root/fields/richText/features/largeBody/client/icon'
import { $getSelection, $isRangeSelection } from 'lexical'

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
