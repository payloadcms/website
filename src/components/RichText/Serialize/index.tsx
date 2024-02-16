import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'

import { CMSLink, Reference } from '@components/CMSLink'
import SplitAnimate from '@components/SplitAnimate'
import SpotlightAnimation from '@components/SpotlightAnimation'
import { AllowedElements } from '@components/SpotlightAnimation/types'
import { Highlight } from '../../Highlight'
import { Label } from '../../Label'
import { LargeBody } from '../../LargeBody'
import { RichTextUpload } from '../Upload'
import { Video } from '../Video'

type Node = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Node[]
  url?: string
  [key: string]: unknown
  newTab?: boolean
}

export type CustomRenderers = {
  [key: string]: (args: { node: Node; Serialize: SerializeFunction; index }) => JSX.Element // eslint-disable-line
}

type SerializeFunction = React.FC<{
  content?: Node[]
  customRenderers?: CustomRenderers
  textInSplitAnimate?: boolean
  skipSpan?: boolean
}>

const isText = (value: any): boolean =>
  typeof value === 'object' && value !== null && typeof value.text === 'string'

export const Serialize: SerializeFunction = ({
  content,
  customRenderers,
  textInSplitAnimate,
  skipSpan,
}) => {
  return (
    <Fragment>
      {content?.map((node, i) => {
        if (isText(node)) {
          let text = skipSpan ? (
            <>{escapeHTML(node.text)}</>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />
          )

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
            text = <Highlight key={i} {...node} />
          }

          if (node.strikethrough) {
            text = (
              <span style={{ textDecoration: 'line-through' }} key={i}>
                {text}
              </span>
            )
          }

          if (textInSplitAnimate && typeof node.text === 'string') {
            text = <SplitAnimate key={i} text={node.text} />
          }

          return <Fragment key={i}>{text}</Fragment>
        }

        if (!node) {
          return null
        }

        if (
          customRenderers &&
          customRenderers[node.type] &&
          typeof customRenderers[node.type] === 'function'
        ) {
          return customRenderers[node.type]({ node, Serialize, index: i })
        }

        switch (node.type) {
          case 'br':
            return <br key={i} />
          case 'h1':
            return (
              <h1 key={i}>
                <Serialize
                  content={node.children}
                  customRenderers={customRenderers}
                  textInSplitAnimate
                />
              </h1>
            )
          case 'h2':
            return (
              <h2 key={i}>
                <Serialize
                  content={node.children}
                  customRenderers={customRenderers}
                  textInSplitAnimate
                />
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </h3>
            )
          case 'h4':
            return (
              <h4 key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </h4>
            )
          case 'h5':
            return (
              <h5 key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </h5>
            )
          case 'h6':
            return (
              <h6 key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </h6>
            )
          case 'quote':
            return (
              <blockquote key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </ul>
            )
          case 'ol':
            return (
              <ol key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </ol>
            )
          case 'li':
            return (
              <li key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </li>
            )
          case 'link':
            return (
              <CMSLink
                key={i}
                type={node.linkType === 'internal' ? 'reference' : 'custom'}
                url={node.url}
                reference={node.doc as Reference}
                newTab={node?.newTab}
              >
                <Serialize content={node.children} customRenderers={customRenderers} />
              </CMSLink>
            )

          case 'upload': {
            return <RichTextUpload key={i} node={node} />
          }

          case 'label':
            return (
              <Label key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </Label>
            )

          case 'large-body': {
            return (
              <LargeBody key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </LargeBody>
            )
          }

          case 'video': {
            const { source, id: videoID } = node

            if (source === 'vimeo' || source === 'youtube') {
              return <Video key={i} platform={source} id={videoID as string} />
            }

            return null
          }

          case 'spotlight': {
            const { element } = node

            const as: AllowedElements = (element as AllowedElements) ?? 'h2'

            return (
              <SpotlightAnimation key={i} as={as} richTextChildren={node.children}>
                <Serialize content={node.children} skipSpan customRenderers={customRenderers} />
              </SpotlightAnimation>
            )
          }

          default:
            return (
              <p key={i}>
                <Serialize content={node.children} customRenderers={customRenderers} />
              </p>
            )
        }
      })}
    </Fragment>
  )
}
