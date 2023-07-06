import React from 'react'

type Props = {
  className?: string
}
export const CommitIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.75 12.75H8.25" />
      <circle cx="12.25" cy="12.75" r="3.5" />
      <path d="M16.25 12.75H19.75" />
    </svg>
  )
}
