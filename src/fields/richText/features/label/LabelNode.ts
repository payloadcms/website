import type {
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  ParagraphNode,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from '@payloadcms/richtext-lexical/lexical'

import {
  $applyNodeReplacement,
  $createParagraphNode,
  ElementNode,
  isHTMLElement,
} from '@payloadcms/richtext-lexical/lexical'
import { addClassNamesToElement } from '@payloadcms/richtext-lexical/lexical/utils'

export type SerializedLabelNode = Spread<
  {
    type: 'label'
  },
  SerializedElementNode
>

/** @noInheritDoc */
export class LabelNode extends ElementNode {
  constructor({ key }: { key?: NodeKey }) {
    super(key)
  }

  static clone(node: LabelNode): LabelNode {
    return new LabelNode({
      key: node.__key,
    })
  }

  static getType(): string {
    return 'label'
  }

  static importJSON(serializedNode: SerializedLabelNode): LabelNode {
    const node = $createLabelNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  canBeEmpty(): true {
    return true
  }

  canInsertTextAfter(): true {
    return true
  }

  canInsertTextBefore(): true {
    return true
  }
  collapseAtStart(): true {
    const paragraph = $createParagraphNode()
    const children = this.getChildren()
    children.forEach((child) => paragraph.append(child))
    this.replace(paragraph)
    return true
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    addClassNamesToElement(element, 'rich-text-label-node')
    return element
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor)

    if (element && isHTMLElement(element)) {
      if (this.isEmpty()) {
        element.append(document.createElement('br'))
      }

      const formatType = this.getFormatType()
      element.style.textAlign = formatType

      const direction = this.getDirection()
      if (direction) {
        element.dir = direction
      }
    }

    return {
      element,
    }
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
    }
  }

  insertNewAfter(_: RangeSelection, restoreSelection?: boolean): ParagraphNode {
    const newBlock = $createParagraphNode()
    const direction = this.getDirection()
    newBlock.setDirection(direction)
    this.insertAfter(newBlock, restoreSelection)
    return newBlock
  }

  // Mutation

  isInline(): false {
    return false
  }

  updateDOM(prevNode: LabelNode, dom: HTMLElement): boolean {
    return false
  }
}

export function $createLabelNode(): LabelNode {
  return $applyNodeReplacement(new LabelNode({}))
}

export function $isLabelNode(node: LexicalNode | null | undefined): node is LabelNode {
  return node instanceof LabelNode
}
