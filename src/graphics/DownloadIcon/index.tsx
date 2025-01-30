import * as React from 'react'

type Props = {
  className?: string
}

export const DownloadIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 14L19 18L5 18L5 14" stroke="currentColor" />
      <path
        d="M16 9.95575L12.0132 13.8804M12.0132 13.8804L8 10M12.0132 13.8804L12 6.13275"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
    </svg>
  )
}
