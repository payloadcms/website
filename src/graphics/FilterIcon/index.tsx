import * as React from 'react'

type Props = {
  className?: string
}

export const FilterIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="14"
      viewBox="0 0 21 14"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 1H21" stroke="#ECECEC" />
      <path d="M3 7H18" stroke="#ECECEC" />
      <path d="M6 13H15" stroke="#ECECEC" />
    </svg>
  )
}
