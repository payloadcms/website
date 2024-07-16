'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  RangeSelection,
} from 'lexical'
import { useEffect, useState } from 'react'
import { PluginComponent } from '@payloadcms/richtext-lexical'
import {
  $createEmbedNode,
  EmbedNode,
  EmbedNodeData,
  INSERT_EMBED_COMMAND,
  OPEN_EMBED_DRAWER_COMMAND,
} from '../nodes/EmbedNode'
import { FieldsDrawer } from '@payloadcms/richtext-lexical/client'
import { useModal } from '@payloadcms/ui'

const drawerSlug = 'lexical-embed-create'

export const EmbedPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()
  const { closeModal, toggleModal } = useModal()
  const [lastSelection, setLastSelection] = useState<RangeSelection | null>()
  const [embedData, setEmbedData] = useState<EmbedNodeData | {}>({})
  const [targetNodeKey, setTargetNodeKey] = useState<string | null>(null)

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_EMBED_COMMAND,
        ({ url }) => {
          if (targetNodeKey) {
            // Replace existing embed node
            const node: EmbedNode = $getNodeByKey(targetNodeKey) as EmbedNode
            if (!node) {
              return false
            }
            node.setData({ url })

            setTargetNodeKey(null)
            return true
          }

          let selection = $getSelection()

          if (!$isRangeSelection(selection)) {
            selection = lastSelection as RangeSelection | null
            if (!$isRangeSelection(selection)) {
              return false
            }
          }

          const focusNode = selection.focus.getNode()

          if (focusNode !== null) {
            const horizontalRuleNode = $createEmbedNode({
              url,
            })
            $insertNodeToNearestRoot(horizontalRuleNode)
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        OPEN_EMBED_DRAWER_COMMAND,
        embedData => {
          setEmbedData(embedData?.data ?? {})
          setTargetNodeKey(embedData?.nodeKey ?? null)

          if (embedData?.nodeKey) {
            toggleModal(drawerSlug)
            return true
          }

          let rangeSelection: RangeSelection | null = null

          editor.getEditorState().read(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              rangeSelection = selection
            }
          })

          if (rangeSelection) {
            setLastSelection(rangeSelection)
            toggleModal(drawerSlug)
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor, lastSelection, targetNodeKey, toggleModal])

  return (
    <FieldsDrawer
      data={embedData}
      drawerSlug={drawerSlug}
      drawerTitle={'Create Embed'}
      featureKey="embed"
      handleDrawerSubmit={(_fields, data) => {
        closeModal(drawerSlug)
        if (!data.url) {
          return
        }

        editor.dispatchCommand(INSERT_EMBED_COMMAND, {
          url: data.url as string,
        })
      }}
      schemaPathSuffix="fields"
    />
  )
}
