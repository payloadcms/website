import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Community Help | Payload',
    template: '%s | Community Help | Payload',
  },
  description:
    'Find what you need faster. The Payload Community Help archive is a great place to start.',
}

export default async ({ children }) => {
  return <>{children}</>
}
