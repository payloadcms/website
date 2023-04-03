import React from 'react'

type Props = {
  className?: string
}
export const CommitIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 15C13.433 15 15 13.433 15 11.5C15 9.567 13.433 8 11.5 8C9.567 8 8 9.567 8 11.5C8 13.433 9.567 15 11.5 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="15.5" y1="11.5" x2="20.5" y2="11.5" stroke="currentColor" strokeLinecap="round" />
      <line x1="2.5" y1="11.5" x2="7.5" y2="11.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  )
}
