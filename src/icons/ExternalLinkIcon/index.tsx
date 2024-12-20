import * as React from 'react'

type Props = {
  className?: string
}
export const ExternalLinkIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.5714 6L11.5 6H7L7 18H19L19 9.42857" />
      <path
        d="M17.2173 3.01558L21.9996 3L21.8891 7.78286M11.5 13.4982L21.9672 3.03061"
        strokeMiterlimit="10"
      />
    </svg>
  )
}
