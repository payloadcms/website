import * as React from 'react'

type Props = {
  className?: string
}
export const CalendarIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="26"
      viewBox="0 0 26 26"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="14" stroke="currentColor" width="16" x="5" y="6.82581" />
      <line stroke="currentColor" x1="9.125" x2="9.125" y1="8.73206" y2="4.41956" />
      <line stroke="currentColor" x1="16.875" x2="16.875" y1="8.73206" y2="4.41956" />
      <line stroke="currentColor" x1="5" x2="21" y1="11.8258" y2="11.8258" />
    </svg>
  )
}
