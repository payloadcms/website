import type { Page } from '@root/payload-types'

type CodeFeatureBlock = Extract<Page['layout'][0], { blockType: 'codeFeature' }>

type CodeFeatures = NonNullable<
  CodeFeatureBlock['codeFeatureFields']['codeTabs']
>[number]['codeFeatures']

export type CodeFeature = NonNullable<CodeFeatures>[number]

export interface Props {
  className?: string
  title?: string
  children: string
  codeFeatures?: CodeFeatures
}
