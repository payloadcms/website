import * as React from 'react'

type Props = {
  className?: string
}

export const CommentsIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 23 20"
      width="23"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 0.571426H21.5714V18.8571L15.4 14.9784H1V0.571426Z"
        stroke="currentColor"
        strokeWidth="1.14286"
      />
    </svg>
  )
}
