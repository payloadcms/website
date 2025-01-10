import type { Metadata } from 'next'

export const metadata: Metadata = {
  description:
    'Find what you need faster. The Payload Community Help archive is a great place to start.',
  title: {
    absolute: 'Community Help | Payload',
    template: '%s | Community Help | Payload',
  },
}

export default async ({ children }) => {
  return <>{children}</>
}
