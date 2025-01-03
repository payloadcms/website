import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TableWithDrawersBlock: Block = {
  slug: 'TableWithDrawers',
  fields: [
    {
      name: 'columns',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'rows',
      type: 'json',
    },
  ],
  interfaceName: 'TableWithDrawersBlock',
  jsx: {
    export: ({ fields, lexicalToMarkdown }) => {
      return {
        props: {
          columns: fields.columns,
          rows: fields.rows,
        },
      }
    },
    import: ({ children, markdownToLexical, props }) => {
      return {
        columns: props.columns,
        rows: props.rows.map((rows: any) => {
          return rows.map((row: any) => ({
            drawerContent:
              row.drawerContent && markdownToLexical
                ? markdownToLexical({ markdown: row.drawerContent })
                : undefined,
            drawerDescription: row.drawerDescription,
            drawerSlug: row.drawerSlug,
            drawerTitle: row.drawerTitle,
            value:
              row.value && markdownToLexical
                ? markdownToLexical({ markdown: row.value })
                : undefined,
          }))
        }),
      }
    },
  },
}
