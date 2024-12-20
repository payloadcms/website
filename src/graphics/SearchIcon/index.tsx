import * as React from 'react'

type Props = {
  className?: string
}

export const SearchIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="26"
      viewBox="0 0 25 26"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.2069" cy="10.9635" r="5" stroke="currentColor" strokeWidth="2" />
      <line
        stroke="currentColor"
        strokeWidth="2"
        x1="14.914"
        x2="20.5002"
        y1="14.2563"
        y2="19.8425"
      />
    </svg>
  )
}
