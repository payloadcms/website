import type { Block } from 'payload'

export const ComponentPreviewBlock: Block = {
  slug: 'ComponentPreview',
  fields: [
    {
      name: 'component',
      type: 'select',
      options: [
        { label: 'AnimateHeight', value: 'AnimateHeight' },
        { label: 'Banner', value: 'Banner' },
        { label: 'Button', value: 'Button' },
        { label: 'Card', value: 'Card' },
        { label: 'Pill', value: 'Pill' },
        { label: 'PillSelector', value: 'PillSelector' },
        { label: 'ShimmerEffect', value: 'ShimmerEffect' },
        { label: 'Thumbnail', value: 'Thumbnail' },
      ],
      required: true,
    },
    {
      name: 'example',
      type: 'select',
      options: [
        { label: 'Actions', value: 'actions' },
        { label: 'Basic', value: 'basic' },
        { label: 'Fallback', value: 'fallback' },
        { label: 'Interactive', value: 'interactive' },
        { label: 'Primary', value: 'primary' },
        { label: 'Sizes', value: 'sizes' },
        { label: 'Styles', value: 'styles' },
        { label: 'Variants', value: 'variants' },
        { label: 'Disabled', value: 'disabled' },
        { label: 'Shapes', value: 'shapes' },
      ],
      required: true,
    },
  ],
  interfaceName: 'ComponentPreviewBlock',
  jsx: {
    export: ({ fields }) => ({
      props: {
        component: fields.component,
        example: fields.example,
      },
    }),
    import: ({ props }) => ({
      component: props?.component,
      example: props?.example,
    }),
  },
}
