import { Button } from '@payloadcms/ui/elements/Button'
import { Card } from '@payloadcms/ui/elements/Card'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const cardExamples: ComponentExamples = {
  actions: {
    code: `<Card
  actions={
    <Button
      aria-label="Create new Post"
      buttonStyle="icon-label"
      icon="plus"
      iconStyle="with-border"
      onClick={() => createPost()}
      round
    />
  }
  title="Posts"
/>`,
    render: () => (
      <div className={classes.cardDemo}>
        <Card
          actions={
            <Button
              aria-label="Create new Post"
              buttonStyle="icon-label"
              icon="plus"
              iconStyle="with-border"
              onClick={() => undefined}
              round
            />
          }
          title="Posts"
        />
      </div>
    ),
  },
  basic: {
    code: `<Card title="Posts" />`,
    render: () => (
      <div className={classes.cardDemo}>
        <Card title="Posts" />
      </div>
    ),
  },
}
