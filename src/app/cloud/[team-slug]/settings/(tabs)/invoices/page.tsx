import { Metadata } from 'next'

import { TeamInvoicesPage } from './client_page'

export default props => {
  return <TeamInvoicesPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Invoices`,
    openGraph: {
      title: `${teamSlug} - Team Invoices`,
      url: `/cloud/${teamSlug}/invoices`,
    },
  }
}
