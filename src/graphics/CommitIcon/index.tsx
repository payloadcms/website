import React from 'react'

type Props = {
  className?: string
}
export const CommitIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="1.05" x2="7" y1="12" y2="12"></line>
      <line x1="17.01" x2="22.96" y1="12" y2="12"></line>
    </svg>
  )
}
