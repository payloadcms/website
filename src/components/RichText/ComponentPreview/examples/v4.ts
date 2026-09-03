import type { ComponentExamples } from './types'

const buttonExamples: ComponentExamples = {
  primary: {
    code: `<Button margin={false}>Save changes</Button>`,
    design: {
      code: `@layer payload {
  .btn--style-primary {
    --color-bg-brand: #6d5dfc;
    --color-bg-brand-hover: #5947e5;
    --color-bg-brand-pressed: #4938cc;
    --color-text-onbrand: #ffffff;
  }
}`,
      description:
        'Scope Payload 4 semantic color tokens to primary Buttons to customize the component without changing the global brand palette.',
      variables: [
        {
          name: '--color-bg-brand',
          description: 'Primary button background.',
        },
        {
          name: '--color-bg-brand-hover',
          description: 'Primary button background on hover.',
        },
        {
          name: '--color-bg-brand-pressed',
          description: 'Primary button background while pressed.',
        },
        {
          name: '--color-text-onbrand',
          description: 'Button label and icon color.',
        },
      ],
    },
  },
}

export const v4ComponentExamples: Record<string, ComponentExamples> = {
  Button: buttonExamples,
}
