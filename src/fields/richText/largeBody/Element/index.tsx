import React from 'react';

import './index.scss';

const baseClass = 'rich-text-large-body';

const LargeBodyElement: React.FC<{
  attributes: any
  element: any
  children: React.ReactNode
}> = ({ attributes, children }) => (
  <span
    {...attributes}
  >
    <span className={baseClass}>
      {children}
    </span>
  </span>
);
export default LargeBodyElement;
