import { redirect } from 'next/navigation'

export default ({
  searchParams: {
    state, // the redirect URL, 'state' is the catch-all query param by the GitHub App API
    code,
  },
}) => {
  const url = new URL(state, process.env.NEXT_PUBLIC_SITE_URL)
  url.searchParams.delete('state')
  url.searchParams.append('code', code)

  redirect(url.href)
}
