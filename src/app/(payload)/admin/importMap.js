import { RichTextCell as RichTextCell_0 } from '@payloadcms/richtext-lexical/client'
import { RichTextField as RichTextField_1 } from '@payloadcms/richtext-lexical/client'
import { getGenerateComponentMap as getGenerateComponentMap_2 } from '@payloadcms/richtext-lexical/generateComponentMap'
import { BoldFeatureClient as BoldFeatureClient_3 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_4 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_5 } from '@payloadcms/richtext-lexical/client'
import { StrikethroughFeatureClient as StrikethroughFeatureClient_6 } from '@payloadcms/richtext-lexical/client'
import { SubscriptFeatureClient as SubscriptFeatureClient_7 } from '@payloadcms/richtext-lexical/client'
import { SuperscriptFeatureClient as SuperscriptFeatureClient_8 } from '@payloadcms/richtext-lexical/client'
import { InlineCodeFeatureClient as InlineCodeFeatureClient_9 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_10 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_11 } from '@payloadcms/richtext-lexical/client'
import { AlignFeatureClient as AlignFeatureClient_12 } from '@payloadcms/richtext-lexical/client'
import { IndentFeatureClient as IndentFeatureClient_13 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_14 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_15 } from '@payloadcms/richtext-lexical/client'
import { ChecklistFeatureClient as ChecklistFeatureClient_16 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_17 } from '@payloadcms/richtext-lexical/client'
import { RelationshipFeatureClient as RelationshipFeatureClient_18 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_19 } from '@payloadcms/richtext-lexical/client'
import { UploadFeatureClient as UploadFeatureClient_20 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_21 } from '@payloadcms/richtext-lexical/client'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_22 } from '@payloadcms/richtext-lexical/client'
import { LabelFeatureClient as LabelFeatureClient_23 } from '@root/fields/richText/features/label/client'
import { LargeBodyFeatureClient as LargeBodyFeatureClient_24 } from '@root/fields/richText/features/largeBody/client'
import { BlocksFeatureClient as BlocksFeatureClient_25 } from '@payloadcms/richtext-lexical/client'
import { OverviewComponent as OverviewComponent_26 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_27 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_28 } from '@payloadcms/plugin-seo/client'
import { MetaImageComponent as MetaImageComponent_29 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_30 } from '@payloadcms/plugin-seo/client'
import { BlogMarkdownField as BlogMarkdownField_31 } from '@root/blocks/BlogMarkdown/Field'
import { default as default_32 } from '@root/globals/CustomRowLabelNavItems'
import { default as default_33 } from '@root/globals/CustomRowLabelTabs'
import { default as default_34 } from '@root/components/SyncDocsButton'
import { default as default_35 } from '@root/components/RedeployButton'

export const importMap = {
  "@payloadcms/richtext-lexical/client#RichTextCell": RichTextCell_0,
  "@payloadcms/richtext-lexical/client#RichTextField": RichTextField_1,
  "@payloadcms/richtext-lexical/generateComponentMap#getGenerateComponentMap": getGenerateComponentMap_2,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_3,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_4,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_5,
  "@payloadcms/richtext-lexical/client#StrikethroughFeatureClient": StrikethroughFeatureClient_6,
  "@payloadcms/richtext-lexical/client#SubscriptFeatureClient": SubscriptFeatureClient_7,
  "@payloadcms/richtext-lexical/client#SuperscriptFeatureClient": SuperscriptFeatureClient_8,
  "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient": InlineCodeFeatureClient_9,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_10,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_11,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient": AlignFeatureClient_12,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient": IndentFeatureClient_13,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_14,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_15,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient": ChecklistFeatureClient_16,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_17,
  "@payloadcms/richtext-lexical/client#RelationshipFeatureClient": RelationshipFeatureClient_18,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_19,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_20,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_21,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_22,
  "@root/fields/richText/features/label/client#LabelFeatureClient": LabelFeatureClient_23,
  "@root/fields/richText/features/largeBody/client#LargeBodyFeatureClient": LargeBodyFeatureClient_24,
  "@payloadcms/richtext-lexical/client#BlocksFeatureClient": BlocksFeatureClient_25,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_26,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_27,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_28,
  "@payloadcms/plugin-seo/client#MetaImageComponent": MetaImageComponent_29,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_30,
  "@root/blocks/BlogMarkdown/Field#BlogMarkdownField": BlogMarkdownField_31,
  "@root/globals/CustomRowLabelNavItems#default": default_32,
  "@root/globals/CustomRowLabelTabs#default": default_33,
  "@root/components/SyncDocsButton#default": default_34,
  "@root/components/RedeployButton#default": default_35
}
