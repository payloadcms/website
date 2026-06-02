import type { Block } from 'payload'

export const CardBlock: Block = {
  slug: 'Card',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      admin: {
        description: 'URL the card links to, e.g. /docs/authentication/overview',
      },
    },
  ],
  interfaceName: 'CardBlock',
  jsx: {
    export: ({ fields }) => ({
      props: {
        description: fields.description,
        link: fields.link,
        title: fields.title,
      },
    }),
    import: ({ props }) => ({
      description: props.description,
      link: props.link,
      title: props.title,
    }),
  },
}
