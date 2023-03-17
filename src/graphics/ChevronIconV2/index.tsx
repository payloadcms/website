import * as React from 'react'

type Props = {
  className?: string
  rotation?: number
}

export const ChevronIconV2: React.FC<Props> = ({ className, rotation }) => {
  return (
    <svg
      width="16"
      height="27"
      viewBox="0 0 16 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined
      }}
    >
      <path
        d="M1.40625 0.738037L14.1682 13.4999L1.40625 26.2618"
        stroke="#ADADAD"
        stroke-width="1.59524"
        stroke-miterlimit="10"
      />
    </svg>
  )
}