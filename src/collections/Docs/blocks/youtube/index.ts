import type { Block } from 'payload'

export const YoutubeBlock: Block = {
  slug: 'YouTube',
  fields: [
    {
      name: 'id',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
    },
  ],
  interfaceName: 'YoutubeBlock',
  jsx: {
    export({ fields }) {
      return {
        props: {
          id: fields.id,
          title: fields.title,
        },
      }
    },
    import({ props }) {
      return {
        id: props.id,
        title: props.title,
      }
    },
  },
}
