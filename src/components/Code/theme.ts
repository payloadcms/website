import { PrismTheme } from 'prism-react-renderer'

export const theme: PrismTheme = {
  plain: {
    color: '#d1d5da',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: '#8b949e',
      },
    },
    {
      types: ['keyword', 'atrule.rule'],
      style: {
        color: '#ff7b72',
      },
    },
    {
      types: ['function'],
      style: {
        color: '#d2a8ff',
      },
    },
    {
      types: [
        'property',
        'key',
        'tag:not(.punctuation):not(.attr-name):not(.attr-value):not(.script)',
        'selector',
      ],
      style: {
        color: '#79d8a9',
      },
    },
    {
      types: ['string', 'template-string', 'attr-value', 'hexcode.color'],
      style: {
        color: '#8cc4ff',
      },
    },
    {
      types: [
        'number',
        'boolean',
        'keyword.nil',
        'null',
        'doctype',
        'attr-name',
        'selector.class',
        'selector.pseudo-class',
        'selector.combinator',
        'property',
        'atrule.keyword',
        'operator',
        'property-access',
      ],
      style: {
        color: '#61afef',
      },
    },
    {
      types: ['variable', 'class-name', 'maybe-class-name'],
      style: {
        color: '#e5c07b',
      },
    },
  ],
}

// export const theme: PrismTheme = {
//   plain: {
//     color: 'var(--color-base-500)',
//   },
//   styles: [
//     {
//       types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
//       style: {
//         color: 'var(--color-base-500)',
//       },
//     },
//     {
//       types: ['plain', 'atrule', 'attr-value', 'keyword'],
//       style: {
//         color: 'var(--color-success-250)',
//       },
//     },
//     {
//       types: ['tag', 'boolean', 'number', 'constant', 'symbol', 'deleted', 'imports'],
//       style: {
//         color: 'var(--color-error-500)',
//       },
//     },
//     {
//       types: ['attr-name', 'char', 'builtin', 'inserted'],
//       style: {
//         color: 'var(--color-base-100)',
//       },
//     },
//     {
//       types: ['operator', 'entity', 'url', 'string'],
//       style: {
//         color: 'var(--color-base-500)',
//       },
//     },
//     {
//       types: ['selector', 'property', 'function'],
//       style: {
//         color: 'var(--color-success-500)',
//       },
//     },
//     {
//       types: ['regex', 'important', 'variable', 'string', 'class-name', 'parameter'],
//       style: {
//         color: 'var(--color-warning-500)',
//       },
//     },
//   ],
// }
