import type { DOMExportOutput, LexicalEditor, ParagraphNode, Spread } from 'lexical'

import { addClassNamesToElement } from '@lexical/utils'
import {
  $applyNodeReplacement,
  $createParagraphNode,
  type EditorConfig,
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type RangeSelection,
  type SerializedElementNode,
  isHTMLElement,
} from 'lexical'

export type SerializedLargeBodyNode = Spread<
  {
    type: 'largeBody'
  },
  SerializedElementNode
>

/** @noInheritDoc */
export class LargeBodyNode extends ElementNode {
  constructor({ key }: { key?: NodeKey }) {
    super(key)
  }

  static clone(node: LargeBodyNode): LargeBodyNode {
    return new LargeBodyNode({
      key: node.__key,
    })
  }

  static getType(): string {
    return 'largeBody'
  }

  static importJSON(serializedNode: SerializedLargeBodyNode): LargeBodyNode {
    const node = $createLargeBodyNode()
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
    children.forEach(child => paragraph.append(child))
    this.replace(paragraph)
    return true
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    addClassNamesToElement(element, 'rich-text-large-body')
    return element
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor)

    if (element && isHTMLElement(element)) {
      if (this.isEmpty()) element.append(document.createElement('br'))

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

  updateDOM(prevNode: LargeBodyNode, dom: HTMLElement): boolean {
    return false
  }
}

export function $createLargeBodyNode(): LargeBodyNode {
  return $applyNodeReplacement(new LargeBodyNode({}))
}

export function $isLargeBodyNode(node: LexicalNode | null | undefined): node is LargeBodyNode {
  return node instanceof LargeBodyNode
}
