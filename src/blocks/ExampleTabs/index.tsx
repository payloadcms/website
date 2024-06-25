import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { ExampleTabsBlock } from '@root/payload-types.js'
import { Tabs } from './Tabs/index.js'

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
