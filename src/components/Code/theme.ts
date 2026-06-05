import type { PrismTheme } from 'prism-react-renderer'

// Faithful GitHub Dark (default) palette. Hex values from @primer/primitives'
// dark scale; TextMate scope → Prism token mappings derived from
// primer/github-vscode-theme/src/theme.js.
export const theme: PrismTheme = {
  plain: {
    color: '#e6edf3',
  },
  styles: [
    {
      style: { color: '#8b949e' },
      types: ['comment', 'prolog', 'cdata'],
    },
    {
      style: { color: '#ff7b72' },
      types: ['keyword', 'storage', 'atrule', 'important', 'rule'],
    },
    {
      style: { color: '#a5d6ff' },
      types: ['string', 'template-string', 'attr-value', 'regex', 'char'],
    },
    {
      style: { color: '#79c0ff' },
      types: [
        'constant',
        'number',
        'boolean',
        'null',
        'symbol',
        'builtin',
        'property',
        'literal-property',
        'attr-name',
        'doctype',
        'url',
        'color',
        'hexcode',
        'unit',
      ],
    },
    {
      style: { color: '#d2a8ff' },
      // `selector` here covers Prism's single selector token type — in GitHub Dark
      // top-level SCSS class selectors render purple; Prism doesn't distinguish
      // primary from nested, so all selectors land here.
      types: ['function', 'function-variable', 'selector'],
    },
    {
      style: { color: '#7ee787' },
      types: ['tag'],
    },
    {
      style: { color: '#ffa657' },
      types: ['variable', 'parameter', 'entity', 'class-name', 'maybe-class-name'],
    },
    // In GitHub Dark, shell args/flags/strings render as one blue mass. The matching
    // override for `plain` tokens (bare identifiers like `payload jobs:run`) lives in
    // the render code — prism-react-renderer hard-skips the theme for `plain`.
    {
      languages: ['bash', 'sh'],
      style: { color: '#79c0ff' },
      types: ['variable', 'parameter', 'string', 'template-string'],
    },
    // JS/TS object literal keys should render plain — CSS properties (also `property`
    // token) keep their blue via the general rule above since this is per-language.
    {
      languages: ['js', 'jsx', 'ts', 'tsx'],
      style: { color: '#e6edf3' },
      types: ['property', 'literal-property'],
    },
    // GraphQL: just the keywords (query/mutation/etc) stay colored. Field names,
    // types, enum constants, and input types all render plain.
    {
      languages: ['graphql'],
      style: { color: '#e6edf3' },
      types: ['property', 'attr-name', 'property-query', 'class-name', 'atom-input', 'constant'],
    },
    // YAML: green keys, blue values, gray comments. Nothing else. `key` carries an
    // `atrule` alias that the general red rule otherwise wins via — include it here
    // so the per-language override wins for both classes on the token.
    {
      languages: ['yaml', 'yml'],
      style: { color: '#7ee787' },
      types: ['key', 'atrule'],
    },
    {
      languages: ['yaml', 'yml'],
      style: { color: '#79c0ff' },
      types: [
        'scalar',
        'string',
        'number',
        'boolean',
        'null',
        'datetime',
        'tag',
        'directive',
        'important',
      ],
    },
  ],
}
