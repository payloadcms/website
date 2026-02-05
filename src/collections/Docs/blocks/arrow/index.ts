import type { Block } from 'payload'

export const ArrowBlock: Block = {
  slug: 'Arrow',
  fields: [
    {
      name: 'direction',
      type: 'select',
      defaultValue: 'down',
      options: [
        { label: 'Down ↓', value: 'down' },
        { label: 'Up ↑', value: 'up' },
        { label: 'Left ←', value: 'left' },
        { label: 'Right →', value: 'right' },
      ],
      required: true,
    },
  ],
  interfaceName: 'ArrowBlock',
  jsx: {
    export: ({ fields }) => {
      return {
        props: {
          direction: fields.direction,
        },
      }
    },
    import: ({ props }) => {
      return {
        direction: props.direction || 'down',
      }
    },
  },
}
