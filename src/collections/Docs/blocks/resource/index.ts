import type { Block } from 'payload'

export const ResourceBlock: Block = {
  slug: 'Resource',
  fields: [
    {
      name: 'id',
      type: 'text',
    },
  ],
  interfaceName: 'ResourceBlock',
  jsx: {
    export({ fields }) {
      return {
        props: {
          id: fields.id,
        },
      }
    },
    import({ props }) {
      return {
        id: props.id,
      }
    },
  },
}
