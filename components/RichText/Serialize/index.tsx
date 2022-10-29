import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { Text } from 'slate'
import { Label } from '../../Label'
import { LargeBody } from '../../LargeBody'
import { Highlight } from '../../Highlight'

type Node = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Node[]
  url?: string
  [key: string]: unknown
}

export const Serialize: React.FC<{
  content: Node[]
  // customRenderers?: {
  //   [key: string]: (node: Node) => JSX.Element // eslint-disable-line
  // }
}> = ({ content }) => {
  return (
    <Fragment>
      {content.map((node, i) => {
        if (Text.isText(node)) {
          let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

          if (node.bold) {
            text = <strong key={i}>{text}</strong>
          }

          if (node.code) {
            text = <code key={i}>{text}</code>
          }

          if (node.italic) {
            text = <em key={i}>{text}</em>
          }

          if (node.underline) {
            // text = (
            //   <span style={{ textDecoration: 'underline' }} key={i}>
            //     {text}
            //   </span>
            // )
            text = <Highlight {...node} />
          }

          if (node.strikethrough) {
            text = (
              <span style={{ textDecoration: 'line-through' }} key={i}>
                {text}
              </span>
            )
          }

          return <Fragment key={i}>{text}</Fragment>
        }

        if (!node) {
          return null
        }

        switch (node.type) {
          case 'h1':
            return (
              <h1 key={i}>
                <Serialize content={node.children} />
              </h1>
            )
          case 'h2':
            return (
              <h2 key={i}>
                <Serialize content={node.children} />
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i}>
                <Serialize content={node.children} />
              </h3>
            )
          case 'h4':
            return (
              <h4 key={i}>
                <Serialize content={node.children} />
              </h4>
            )
          case 'h5':
            return (
              <h5 key={i}>
                <Serialize content={node.children} />
              </h5>
            )
          case 'h6':
            return (
              <h6 key={i}>
                <Serialize content={node.children} />
              </h6>
            )
          case 'quote':
            return (
              <blockquote key={i}>
                <Serialize content={node.children} />
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={i}>
                <Serialize content={node.children} />
              </ul>
            )
          case 'ol':
            return (
              <ol key={i}>
                <Serialize content={node.children} />
              </ol>
            )
          case 'li':
            return (
              <li key={i}>
                <Serialize content={node.children} />
              </li>
            )
          case 'link':
            return (
              <a href={escapeHTML(node.url)} key={i}>
                <Serialize content={node.children} />
              </a>
            )

          case 'label':
            return (
              <Label key={i}>
                <Serialize content={node.children} />
              </Label>
            )

          case 'large-body': {
            return (
              <LargeBody key={i}>
                <Serialize content={node.children} />
              </LargeBody>
            )
          }

          default:
            return (
              <p key={i}>
                <Serialize content={node.children} />
              </p>
            )
        }
      })}
    </Fragment>
  )
}
