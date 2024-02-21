import type { Page } from '@root/payload-types'

type CodeFeatureBlock = Extract<Page['layout'][0], { blockType: 'codeFeature' }>

type CodeBlips = NonNullable<CodeFeatureBlock['codeFeatureFields']['codeTabs']>[number]['codeBlips']

export type CodeBlip = NonNullable<CodeBlips>[number]

export interface Props {
  className?: string
  title?: string
  children: string
  codeBlips?: CodeBlips
  showLineNumbers?: boolean
}
