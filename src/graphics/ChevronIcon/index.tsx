import React from 'react'

export const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="25"
      viewBox="0 0 25 25"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.5 16L14.5 12.5L10.5 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
