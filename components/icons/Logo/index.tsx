import * as React from 'react'

type Props = {
  className?: string
}
export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_102_693)">
        <path
          d="M16.4853 2.06641L30.0016 10.1911V25.6124L19.8239 31.5002V16.0789L6.29138 7.965L16.4853 2.06641Z"
          fill="currentColor"
        />
        <path d="M15.4493 30.6451V18.6113L5.25 24.5099L15.4493 30.6451Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_102_693">
          <rect width="24.5" height="31.5" fill="white" transform="translate(5.25)" />
        </clipPath>
      </defs>
    </svg>
  )
}
