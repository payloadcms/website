import type {
  DOMExportOutput,
  ElementFormatType,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical'

import { $applyNodeReplacement, createCommand } from 'lexical'
import * as React from 'react'
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode'

const EmbedComponent = React.lazy(() =>
  import('../components/EmbedNodeComponent').then((module) => ({
    default: module.EmbedNodeComponent,
  })),
)

export type EmbedNodeData = {
  url: string
}

export type SerializedEmbedNode = Spread<
  {
    children?: never // required so that our typed editor state doesn't automatically add children
    type: 'embed'
    fields: EmbedNodeData
  },
  SerializedDecoratorBlockNode
>

export const INSERT_EMBED_COMMAND: LexicalCommand<EmbedNodeData> =
  createCommand('INSERT_EMBED_COMMAND')

export const OPEN_EMBED_DRAWER_COMMAND: LexicalCommand<{
  data?: EmbedNodeData | null
  nodeKey?: string
}> = createCommand('OPEN_EMBED_DRAWER_COMMAND')

export class EmbedNode extends DecoratorBlockNode {
  __data: EmbedNodeData

  constructor({
    data,
    format,
    key,
  }: {
    data: EmbedNodeData
    format?: ElementFormatType
    key?: NodeKey
  }) {
    super(format, key)
    this.__data = data
  }

  static clone(node: EmbedNode): EmbedNode {
    return new EmbedNode({
      data: node.__data,
      format: node.__format,
      key: node.__key,
    })
  }

  static getType(): string {
    return 'embed'
  }

  /**
   * The data for this node is stored serialized as JSON. This is the "load function" of that node: it takes the saved data and converts it into a node.
   */
  static importJSON(serializedNode: SerializedEmbedNode): EmbedNode {
    const importedData: EmbedNodeData = {
      url: serializedNode.fields.url,
    }
    const node = $createEmbedNode(importedData)
    node.setFormat(serializedNode.format)
    return node
  }

  /**
   * Allows you to render a React component within whatever createDOM returns.
   */
  decorate(): React.ReactElement {
    return <EmbedComponent nodeKey={this.__key} data={this.__data} />
  }

  exportDOM(): DOMExportOutput {
    return { element: document.createElement('div') }
  }

  exportJSON(): SerializedEmbedNode {
    return {
      ...super.exportJSON(),
      fields: this.getData(),
      type: 'embed',
      version: 2,
    }
  }

  getData(): EmbedNodeData {
    return this.getLatest().__data
  }

  setData(data: EmbedNodeData): void {
    const writable = this.getWritable()
    writable.__data = data
  }

  getTextContent(): string {
    return '\n'
  }
}

export function $createEmbedNode(data: EmbedNodeData): EmbedNode {
  return $applyNodeReplacement(
    new EmbedNode({
      data,
    }),
  )
}

export function $isEmbedNode(node: LexicalNode | null | undefined): node is EmbedNode {
  return node instanceof EmbedNode
}
