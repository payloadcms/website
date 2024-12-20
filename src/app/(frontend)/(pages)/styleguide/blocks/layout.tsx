import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Blocks',
    template: '%s | Blocks | Styleguide',
  },
}

export default async ({ children }) => {
  return <>{children}</>
}
