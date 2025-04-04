import type { Field } from 'payload'

export const addToDocs: Field = {
  name: 'addToDocs',
  type: 'text',
  admin: {
    components: {
      Label: '@root/fields/addToDocs/Label#Label',
    },
    description: 'Paste this code into the docs to link to this post',
    position: 'sidebar',
  },
  hooks: {
    beforeChange: [
      ({ originalDoc }) => {
        return `<Resource id="${originalDoc?.id}" />`
      },
    ],
  },
}
