import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { ExampleTabsBlock } from '@root/payload-types'
import { Tabs } from './Tabs'

import classes from './index.module.scss'

type Props = ExampleTabsBlock

export const ExampleTabs: React.FC<Props> = exampleTabsFields => {
  const { content, tabs } = exampleTabsFields

  return (
    <Gutter className={classes.exampleTabsBlock}>
      {content && <RichText content={content} className={classes.content} />}
      {tabs && <Tabs tabs={tabs} />}
    </Gutter>
  )
}
