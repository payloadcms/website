'use client'

import type { Reference } from '@components/CMSLink'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedLabelNode } from '@root/fields/richText/features/label/LabelNode'
import type { SerializedLargeBodyNode } from '@root/fields/richText/features/largeBody/LargeBodyNode'
import type {
  BannerBlock,
  BrBlock,
  CodeBlock,
  CommandLineBlock,
  LightDarkImageBlock,
  RestExamplesBlock,
  SpotlightBlock,
  TableWithDrawersBlock,
  TemplateCardsBlock,
  UploadBlock,
  VideoBlock,
  YoutubeBlock,
} from '@types'

import { Banner } from '@components/Banner'
import { CMSLink } from '@components/CMSLink'
import Code from '@components/Code/index.js'
import { CommandLine } from '@components/CommandLine'
import { Label } from '@components/Label'
import { LargeBody } from '@components/LargeBody'
import RichTextUpload from '@components/RichText/Upload'
import { Video } from '@components/RichText/Video'
import SpotlightAnimation from '@components/SpotlightAnimation'
import { TemplateCards } from '@components/TemplateCardsBlock'
import YouTube from '@components/YouTube/index.js'

import './index.scss'

import {
  type JSXConverters,
  type JSXConvertersFunction,
  RichText as SerializedRichText,
} from '@payloadcms/richtext-lexical/react'
import React, { useCallback, useState } from 'react'

import type { AllowedElements } from '../SpotlightAnimation/types.js'

import { type AddHeading, type Heading, type IContext, RichTextContext } from './context.js'
import { Heading as HeadingComponent } from './Heading'
import LightDarkImage from './LightDarkImage/index.js'
import { RestExamples } from './RestExamples'
import { CustomTableJSXConverters } from './Table/index.js'
import { TableWithDrawers } from './TableWithDrawers'
import { UploadBlockImage } from './UploadBlock/index.js'

type Props = {
  className?: string
  content: any
}

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | BannerBlock
      | BrBlock
      | CodeBlock
      | CommandLineBlock
      | LightDarkImageBlock
      | RestExamplesBlock
      | SpotlightBlock
      | TableWithDrawersBlock
      | TemplateCardsBlock
      | UploadBlock
      | VideoBlock
      | YoutubeBlock
    >
  | SerializedLabelNode
  | SerializedLargeBodyNode

export const jsxConverters: (args: { toc?: boolean }) => JSXConvertersFunction<NodeTypes> =
  ({ toc }) =>
  ({ defaultConverters }) => {
    const converters: JSXConverters<NodeTypes> = {
      ...defaultConverters,
      ...CustomTableJSXConverters,
      blocks: {
        Banner: ({ node }) => {
          return <Banner content={node.fields.content} type={node.fields.type} />
        },
        br: () => <br />,
        Code: ({ node }) => {
          const codeString: string = node.fields.code ?? ''
          return (
            <Code children={codeString?.trim()} disableMinHeight parentClassName={'lexical-code'} />
          )
        },
        commandLine: ({ node }) => {
          const { command } = node.fields
          if (command) {
            return <CommandLine command={command} lexical />
          }
          return null
        },
        LightDarkImage: ({ node }) => {
          return (
            <LightDarkImage
              alt={node.fields.alt ?? ''}
              caption={node.fields.caption ?? ''}
              srcDark={node.fields.srcDark}
              srcLight={node.fields.srcLight}
            />
          )
        },
        RestExamples: ({ node }) => {
          return <RestExamples data={node.fields.data} />
        },
        spotlight: ({ node, nodesToJSX }) => {
          const { element, richText } = node.fields

          const as: AllowedElements = (element as AllowedElements) ?? 'h2'

          const Children = nodesToJSX({
            nodes: richText?.root?.children as SerializedLexicalNode[],
          })

          return (
            <SpotlightAnimation as={as} richTextChildren={node.children}>
              {Children}
            </SpotlightAnimation>
          )
        },
        TableWithDrawers: ({ node }) => {
          return (
            <TableWithDrawers
              columns={node.fields.columns as unknown as any}
              rows={node.fields.rows as unknown as any}
            />
          )
        },
        templateCards: ({ node }) => {
          const { templates } = node.fields
          if (!templates) {
            return null
          }
          return <TemplateCards templates={templates} />
        },
        Upload: ({ node }) => {
          return (
            <UploadBlockImage
              alt={node.fields.alt ?? undefined}
              caption={node.fields.caption ?? undefined}
              src={node.fields.src}
            />
          )
        },
        video: ({ node }) => {
          const { url } = node.fields

          if (url && (url.includes('vimeo') || url.includes('youtube'))) {
            const source = url.includes('vimeo') ? 'vimeo' : 'youtube'
            const id = source === 'vimeo' ? url.split('/').pop() : url.split('v=').pop()

            return <Video id={id as string} platform={source} />
          }

          return null
        },
        YouTube: ({ node }) => {
          return <YouTube id={node.fields.id} title={node.fields.title ?? ''} />
        },
      },
      label: ({ node, nodesToJSX }) => {
        return <Label>{nodesToJSX({ nodes: node.children })}</Label>
      },
      largeBody: ({ node, nodesToJSX }) => {
        return <LargeBody>{nodesToJSX({ nodes: node.children })}</LargeBody>
      },
      link: ({ node, nodesToJSX }) => {
        const fields = node.fields

        return (
          <CMSLink
            newTab={Boolean(fields?.newTab)}
            reference={fields.doc as Reference}
            type={fields.linkType === 'internal' ? 'reference' : 'custom'}
            url={fields.url}
          >
            {nodesToJSX({ nodes: node.children })}
          </CMSLink>
        )
      },
      upload: ({ node }) => {
        return <RichTextUpload node={node} />
      },
    }

    if (toc) {
      converters.heading = HeadingComponent as any
    }

    return converters
  }

export const RichTextWithTOC: React.FC<Props> = ({ className, content }) => {
  const [toc, setTOC] = useState<Map<string, Heading>>(new Map())

  const addHeading: AddHeading = useCallback(
    (anchor, heading, type) => {
      if (!toc.has(anchor)) {
        const newTOC = new Map(toc)
        newTOC.set(anchor, { type, anchor, heading })
        setTOC(newTOC)
      }
    },
    [toc],
  )

  if (!content) {
    return null
  }

  const context: IContext = {
    addHeading,
    toc: Array.from(toc).reverse(),
  }

  return (
    <RichTextContext.Provider value={context}>
      <SerializedRichText
        className={['payload-richtext', 'docs-richtext', className].filter(Boolean).join(' ')}
        converters={jsxConverters({ toc: true })}
        data={content}
      />
    </RichTextContext.Provider>
  )
}

export const RichText: React.FC<Props> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <SerializedRichText
      className={['payload-richtext', className].filter(Boolean).join(' ')}
      converters={jsxConverters({ toc: false })}
      data={content}
    />
  )
}
