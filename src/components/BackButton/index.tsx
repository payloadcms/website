'use client'

import { useRouter } from 'next/navigation'

export const BackButton: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const router = useRouter()

  return (
    <button className={className} onClick={() => router.back()}>
      {children}
    </button>
  )
}
