import type { Block } from 'payload'

export const BulletListBlock: Block = {
  slug: 'BulletList',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'check',
          options: [
            { label: 'Checkmark (Green)', value: 'check' },
            { label: 'X (Red)', value: 'x' },
          ],
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'BulletListBlock',
  jsx: {
    export: ({ fields }) => {
      const itemsProps = fields.items
        .map((item: any) => {
          const escapedText = item.text.replace(/"/g, '\\"')
          return `{ text: "${escapedText}", icon: "${item.icon}" }`
        })
        .join(', ')

      return `<BulletList items={[${itemsProps}]} />`
    },
    import: ({ props }) => {
      return {
        items: props.items || [],
      }
    },
  },
}
