declare module '@mdx-js/runtime' {
  import React from 'react';

  type MDX = React.ComponentType

  const mdx: MDX;
  export default mdx;
}
