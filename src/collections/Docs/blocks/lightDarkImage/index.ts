import type { Block } from 'payload'

export const LightDarkImageBlock: Block = {
  slug: 'LightDarkImage',
  fields: [
    {
      name: 'srcLight',
      type: 'text',
      required: true,
    },
    {
      name: 'srcDark',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  interfaceName: 'LightDarkImageBlock',
  jsx: {
    export: ({ fields }) => {
      return {
        props: {
          alt: fields.alt,
          caption: fields.caption,
          srcDark: fields.srcDark,
          srcLight: fields.srcLight,
        },
      }
    },
    import: ({ props }) => {
      return {
        alt: props.alt,
        caption: props.caption,
        srcDark: props.srcDark,
        srcLight: props.srcLight,
      }
    },
  },
}
