import * as React from 'react'

type Props = {
  className?: string
}

export const ChevronUpDownIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
