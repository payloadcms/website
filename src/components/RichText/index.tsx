import { Banner } from '@components/Banner'
import { CommandLine } from '@components/CommandLine'
import { Video } from '@components/RichText/Video'
import SpotlightAnimation from '@components/SpotlightAnimation'
import { TemplateCards } from '@components/TemplateCardsBlock'
import {
  type JSXConvertersFunction,
  RichText as SerializedRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'
import RichTextUpload from '@components/RichText/Upload'

import type { AllowedElements } from '../SpotlightAnimation/types.js'
import {
  BrBlock,
  SpotlightBlock,
  VideoBlock,
  CommandLineBlock,
  TemplateCardsBlock,
  BannerBlock,
} from '@types'
import classes from './index.module.scss'
import { CMSLink, Reference } from '@components/CMSLink'
import { Label } from '@components/Label'
import { LargeBody } from '@components/LargeBody'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { SerializedLabelNode } from '@root/fields/richText/features/label/LabelNode'
import { SerializedLargeBodyNode } from '@root/fields/richText/features/largeBody/LargeBodyNode'
import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  className?: string
  content: any
}

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      SpotlightBlock | VideoBlock | BrBlock | CommandLineBlock | TemplateCardsBlock | BannerBlock
    >
  | SerializedLabelNode
  | SerializedLargeBodyNode

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    banner: ({ node }) => {
      return <Banner {...node.fields} />
    },
    br: () => <br />,
    commandLine: ({ node }) => {
      const { command } = node.fields
      if (command) return <CommandLine command={command} lexical />
      return null
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
      if (!templates) return null
      return <TemplateCards templates={templates} />
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
  label: ({ node, nodesToJSX }) => {
    return <Label>{nodesToJSX({ nodes: node.children })}</Label>
  },
  largeBody: ({ node, nodesToJSX }) => {
    return <LargeBody>{nodesToJSX({ nodes: node.children })}</LargeBody>
  },
})
export const RichText: React.FC<Props> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <SerializedRichText
      className={[classes.richText, className].filter(Boolean).join(' ')}
      converters={jsxConverters}
      data={content}
    />
  )
}

export default RichText
