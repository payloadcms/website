import { Button } from '@payloadcms/ui/elements/Button'

import type { ComponentDesign, ComponentExamples } from './types'

import classes from '../examples.module.scss'

const buttonColorDesign: ComponentDesign = {
  code: `.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}`,
  description:
    'Add this override to your Admin Panel stylesheet to change primary Buttons without changing the rest of the Payload color system.',
  variables: [
    {
      name: '--bg-color',
      description: 'Button background.',
    },
    {
      name: '--color',
      description: 'Button label and icon color.',
    },
    {
      name: '--hover-bg',
      description: 'Background shown on hover, focus, and active states.',
    },
    {
      name: '--hover-color',
      description: 'Label and icon color shown on hover, focus, and active states.',
    },
    {
      name: '--btn-border',
      description: 'Optional button border.',
    },
    {
      name: '--hover-btn-border',
      description: 'Optional border shown on hover, focus, and active states.',
    },
  ],
}

const buttonDisabledDesign: ComponentDesign = {
  code: `.btn--style-primary.btn--disabled {
  --bg-color: #e3e1f5;
  --color: #625d82;
}`,
  description:
    'Disabled styles use a more specific selector. Target both classes to customize the unavailable state without changing enabled Buttons.',
  variables: [
    {
      name: '--bg-color',
      description: 'Disabled button background.',
    },
    {
      name: '--color',
      description: 'Disabled label and icon color.',
    },
  ],
}

const buttonSizeDesign: ComponentDesign = {
  code: `.btn--size-medium {
  --btn-padding-block-start: 0.5rem;
  --btn-padding-inline-end: 1rem;
  --btn-padding-block-end: 0.5rem;
  --btn-padding-inline-start: 1rem;
}`,
  description:
    'Target a size class in your Admin Panel stylesheet when a project needs different Button dimensions.',
  variables: [
    {
      name: '--btn-padding-block-start',
      description: 'Top padding.',
    },
    {
      name: '--btn-padding-inline-end',
      description: 'Right padding in left-to-right layouts.',
    },
    {
      name: '--btn-padding-block-end',
      description: 'Bottom padding.',
    },
    {
      name: '--btn-padding-inline-start',
      description: 'Left padding in left-to-right layouts.',
    },
  ],
}

const buttonStylesDesign: ComponentDesign = {
  code: `.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}

.btn--style-secondary {
  --color: #6d5dfc;
  --btn-border: 1px solid #6d5dfc;
  --hover-color: #5947e5;
  --hover-btn-border: 1px solid #5947e5;
}

.btn--style-error {
  --bg-color: #c7362f;
  --color: #ffffff;
  --hover-bg: #a92c27;
  --hover-color: #ffffff;
}`,
  description:
    'Each Button style has its own class, so a project can customize primary, secondary, and destructive actions independently.',
  variables: buttonColorDesign.variables,
}

export const buttonExamples: ComponentExamples = {
  disabled: {
    code: `<Button disabled margin={false}>Save changes</Button>`,
    design: buttonDisabledDesign,
    render: () => (
      <Button disabled margin={false}>
        Save changes
      </Button>
    ),
  },
  primary: {
    code: `<Button margin={false}>Save changes</Button>`,
    design: buttonColorDesign,
    render: () => <Button margin={false}>Save changes</Button>,
  },
  sizes: {
    code: `<Button margin={false} size="xsmall">Extra small</Button>
<Button margin={false} size="small">Small</Button>
<Button margin={false} size="medium">Medium</Button>
<Button margin={false} size="large">Large</Button>`,
    design: buttonSizeDesign,
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
    design: buttonStylesDesign,
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
