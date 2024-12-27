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
  SpotlightBlock,
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
import {
  type JSXConvertersFunction,
  RichText as SerializedRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { AllowedElements } from '../SpotlightAnimation/types.js'

import './index.scss'
import LightDarkImage from './LightDarkImage/index.js'
import { CustomTableJSXConverters } from './Table/index.js'
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
      | SpotlightBlock
      | TemplateCardsBlock
      | UploadBlock
      | VideoBlock
      | YoutubeBlock
    >
  | SerializedLabelNode
  | SerializedLargeBodyNode

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...CustomTableJSXConverters,
  blocks: {
    banner: ({ node }) => {
      return <Banner content={node.fields.content} type={node.fields.type} />
    },
    br: () => <br />,
    code: ({ node }) => {
      const codeString: string = node.fields.code ?? ''
      return <Code children={codeString?.trim()} disableMinHeight />
    },
    commandLine: ({ node }) => {
      const { command } = node.fields
      if (command) {
        return <CommandLine command={command} lexical />
      }
      return null
    },
    lightDarkImage: ({ node }) => {
      return (
        <LightDarkImage
          alt={node.fields.alt ?? ''}
          caption={node.fields.caption ?? ''}
          srcDark={node.fields.srcDark}
          srcLight={node.fields.srcLight}
        />
      )
    },
    spotlight: ({ node, nodesToJSX }) => {
      const { element, richText } = node.fields

      const as: AllowedElements = (element as AllowedElements) ?? 'h2'

      const Children = nodesToJSX({ nodes: richText?.root?.children as SerializedLexicalNode[] })

      return (
        <SpotlightAnimation as={as} richTextChildren={node.children}>
          {Children}
        </SpotlightAnimation>
      )
    },
    templateCards: ({ node }) => {
      const { templates } = node.fields
      if (!templates) {
        return null
      }
      return <TemplateCards templates={templates} />
    },
    upload: ({ node }) => {
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
    youtube: ({ node }) => {
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
})
export const RichText: React.FC<Props> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <SerializedRichText
      className={['payload-richtext', className].filter(Boolean).join(' ')}
      converters={jsxConverters}
      data={content}
    />
  )
}

export default RichText
