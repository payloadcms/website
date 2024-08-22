'use client'
import { $setBlocksType } from '@lexical/selection'
import { $findMatchingParent } from '@lexical/utils'
import {
  createClientFeature,
  getSelectedNode,
  toolbarTextDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import {
  $createLabelNode,
  $isLabelNode,
  LabelNode,
} from '@root/fields/richText/features/label/LabelNode'
import { LabelIcon } from '@root/fields/richText/features/label/client/icon'
import { $getSelection, $isRangeSelection } from 'lexical'

import './styles.scss'

export const LabelFeatureClient = createClientFeature({
  nodes: [LabelNode],
  slashMenu: {
    groups: [
      {
        items: [
          {
            Icon: LabelIcon,
            key: 'label',
            keywords: ['label'],
            label: 'Label',
            onSelect: () => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createLabelNode())
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
          ChildComponent: LabelIcon,
          isActive: ({ selection }) => {
            if ($isRangeSelection(selection)) {
              const selectedNode = getSelectedNode(selection)
              const labelParent = $findMatchingParent(selectedNode, $isLabelNode)
              return labelParent != null
            }
            return false
          },
          key: 'label',
          label: `Label`,
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection = $getSelection()
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createLabelNode())
              }
            })
          },
          order: 300,
        },
      ]),
    ],
  },
})
