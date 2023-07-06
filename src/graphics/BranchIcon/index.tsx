import React from 'react'

type Props = {
  className?: string
}
export const BranchIcon: React.FC<Props> = ({ className }) => {
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
      <circle cx="8.5" cy="7.75" r="2" />
      <circle cx="8.5" cy="17.75" r="2" />
      <circle cx="16.5" cy="7.75" r="2" />
      <path d="M8.5 9.75V15.75" />
      <path d="M8.5 14.75V14.75C8.5 13.6454 9.39543 12.75 10.5 12.75H14.5C15.6046 12.75 16.5 11.8546 16.5 10.75V9.75" />
    </svg>
  )
}
