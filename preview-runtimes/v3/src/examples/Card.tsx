import { Button } from '@payloadcms/ui/elements/Button'
import { Card } from '@payloadcms/ui/elements/Card'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const cardExamples: ComponentRenders = {
  actions: {
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
    render: () => (
      <div className={classes.cardDemo}>
        <Card title="Posts" />
      </div>
    ),
  },
}
