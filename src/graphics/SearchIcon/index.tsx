import * as React from 'react'

type Props = {
  className?: string
}

export const SearchIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.2069" cy="10.9635" r="5" stroke="currentColor" strokeWidth="2" />
      <line
        x1="14.914"
        y1="14.2563"
        x2="20.5002"
        y2="19.8425"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}
