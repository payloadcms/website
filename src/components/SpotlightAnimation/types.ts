export type AllowedElements = Extract<
  keyof JSX.IntrinsicElements,
  'p' | 'span' | 'h1' | 'h2' | 'h3'
>
