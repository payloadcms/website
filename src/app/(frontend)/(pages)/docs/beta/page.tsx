import { redirect } from 'next/navigation'

export default function BetaDocsPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true') {
    redirect('/docs')
  }

  redirect('/docs/beta/getting-started/what-is-payload')
}
