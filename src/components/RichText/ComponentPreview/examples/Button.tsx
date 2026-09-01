import { Button } from '@payloadcms/ui/elements/Button'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const buttonExamples: ComponentExamples = {
  disabled: {
    code: `<Button disabled margin={false}>Save changes</Button>`,
    render: () => (
      <Button disabled margin={false}>
        Save changes
      </Button>
    ),
  },
  primary: {
    code: `<Button margin={false}>Save changes</Button>`,
    render: () => <Button margin={false}>Save changes</Button>,
  },
  sizes: {
    code: `<Button margin={false} size="xsmall">Extra small</Button>
<Button margin={false} size="small">Small</Button>
<Button margin={false} size="medium">Medium</Button>
<Button margin={false} size="large">Large</Button>`,
    render: () => (
      <div className={classes.row}>
        <Button margin={false} size="xsmall">
          Extra small
        </Button>
        <Button margin={false} size="small">
          Small
        </Button>
        <Button margin={false} size="medium">
          Medium
        </Button>
        <Button margin={false} size="large">
          Large
        </Button>
      </div>
    ),
  },
  styles: {
    code: `<Button margin={false}>Primary</Button>
<Button buttonStyle="secondary" margin={false}>Secondary</Button>
<Button buttonStyle="error" margin={false}>Delete</Button>`,
    render: () => (
      <div className={classes.row}>
        <Button margin={false}>Primary</Button>
        <Button buttonStyle="secondary" margin={false}>
          Secondary
        </Button>
        <Button buttonStyle="error" margin={false}>
          Delete
        </Button>
      </div>
    ),
  },
}
