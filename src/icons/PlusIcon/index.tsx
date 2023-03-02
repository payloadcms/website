import * as React from 'react'

type Props = {
  className?: string
}
export const PlusIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
