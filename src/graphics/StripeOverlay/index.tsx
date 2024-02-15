import * as React from 'react'

type Props = {
  className?: string
}

export const StripeOverlay: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      width="400"
      height="100%"
      // viewBox="0 0 400 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="19" height="100%" fill="#0A0A0A" />
      <rect x="20" width="19" height="100%" fill="#0A0A0A" />
      <rect x="40" width="19" height="100%" fill="#0A0A0A" />
      <rect x="60" width="19" height="100%" fill="#0A0A0A" />
      <rect x="80" width="19" height="100%" fill="#0A0A0A" />
      <rect x="100" width="19" height="100%" fill="#0A0A0A" />
      <rect x="120" width="19" height="100%" fill="#0A0A0A" />
      <rect x="140" width="19" height="100%" fill="#0A0A0A" />
      <rect x="160" width="19" height="100%" fill="#0A0A0A" />
      <rect x="180" width="19" height="100%" fill="#0A0A0A" />
      <rect x="200" width="19" height="100%" fill="#0A0A0A" />
      <rect x="220" width="19" height="100%" fill="#0A0A0A" />
      <rect x="240" width="19" height="100%" fill="#0A0A0A" />
      <rect x="260" width="19" height="100%" fill="#0A0A0A" />
      <rect x="280" width="19" height="100%" fill="#0A0A0A" />
      <rect x="300" width="19" height="100%" fill="#0A0A0A" />
      <rect x="320" width="19" height="100%" fill="#0A0A0A" />
      <rect x="340" width="19" height="100%" fill="#0A0A0A" />
      <rect x="360" width="19" height="100%" fill="#0A0A0A" />
      <rect x="380" width="19" height="100%" fill="#0A0A0A" />
    </svg>
  )
}
