import type { Block } from 'payload'

export const ResourceBlock: Block = {
  slug: 'Resource',
  fields: [
    {
      name: 'post',
      type: 'text',
    },
  ],
  interfaceName: 'ResourceBlock',
  jsx: {
    export({ fields }) {
      return {
        props: {
          id: fields.post,
        },
      }
    },
    import({ props }) {
      return {
        post: props.id,
      }
    },
  },
}
