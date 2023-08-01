export const configs = {
  'array-example': `
const ExampleCollection = {
  slug: "example-collection",
  fields: [
    {
      name: "arrayField",
      type: "array",
      fields: [
        {
          name: "textField",
          type: "text",
        },
      ],
    },
    {
      type: "ui",
      name: "customArrayManager",
      admin: {
        components: {
          Field: CustomArrayManager,
        },
      },
    },
  ],
}`,
}
