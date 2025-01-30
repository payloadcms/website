import * as React from 'react'

type Props = {
  className?: string
}

export const SearchIconV2: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="26"
      viewBox="0 0 25 26"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.7416 17.3024L24.2392 24.8M19.4083 10.8645C19.4083 15.8928 15.332 19.969 10.3037 19.969C5.27545 19.969 1.19922 15.8928 1.19922 10.8645C1.19922 5.83623 5.27545 1.75999 10.3037 1.75999C15.332 1.75999 19.4083 5.83623 19.4083 10.8645Z"
        stroke="#ECECEC"
        strokeWidth="1.62"
      />
    </svg>
  )
}
