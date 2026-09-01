import { Button } from '@payloadcms/ui/elements/Button'
import { Card } from '@payloadcms/ui/elements/Card'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const cardExamples: ComponentExamples = {
  actions: {
    code: `<Card
  actions={<Button buttonStyle="secondary" margin={false} size="small">Edit</Button>}
  title="Posts"
/>`,
    render: () => (
      <div className={classes.componentWidth}>
        <Card
          actions={
            <Button buttonStyle="secondary" margin={false} size="small">
              Edit
            </Button>
          }
          title="Posts"
        />
      </div>
    ),
  },
  basic: {
    code: `<Card title="Posts" />`,
    render: () => (
      <div className={classes.componentWidth}>
        <Card title="Posts" />
      </div>
    ),
  },
}
