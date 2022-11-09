import * as React from 'react'

type Props = {
  className?: string
}
export const CalendarIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="6.82581" width="16" height="14" stroke="currentColor" />
      <line x1="9.125" y1="8.73206" x2="9.125" y2="4.41956" stroke="currentColor" />
      <line x1="16.875" y1="8.73206" x2="16.875" y2="4.41956" stroke="currentColor" />
      <line x1="5" y1="11.8258" x2="21" y2="11.8258" stroke="currentColor" />
    </svg>
  )
}
