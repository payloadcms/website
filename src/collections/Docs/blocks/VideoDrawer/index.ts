import type { Block } from 'payload'

export const VideoDrawerBlock: Block = {
  slug: 'VideoDrawer',
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'drawerTitle',
      type: 'text',
      required: true,
    },
  ],
  interfaceName: 'VideoDrawerBlock',
  jsx: {
    export: ({ fields }) => {
      return {
        props: {
          id: fields.id,
          drawerTitle: fields.drawerTitle,
          label: fields.label,
        },
      }
    },
    import: ({ props }) => {
      return {
        id: props.id,
        drawerTitle: props.drawerTitle,
        label: props.label,
      }
    },
  },
}
