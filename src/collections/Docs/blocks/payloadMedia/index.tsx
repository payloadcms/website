import type { Block } from 'payload'

export const PayloadMediaBlock: Block = {
  slug: 'PayloadMedia',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  interfaceName: 'PayloadMediaBlock',
  jsx: {
    export: ({ fields }) => {
      return {
        props: {
          caption: fields.caption,
          mediaID: typeof fields.media === 'object' ? fields.media.id : fields.media,
        },
      }
    },
    import: ({ props }) => {
      return {
        caption: props.caption,
        mediaID: props.mediaID,
      }
    },
  },
}
