import * as React from 'react'

type Props = {
  className?: string
}
export const CheckmarkIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6092 16.0192L17.6477 8.98076"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
      <path
        d="M7.35229 12.7623L10.6092 16.0192"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}
