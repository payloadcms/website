import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { fetchGlobals } from '@root/app/_graphql'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer } = await fetchGlobals()

  return (
    <>
      <Header {...mainMenu} />
      <div>
        {children}
        <div id="docsearch" />
        <Footer {...footer} />
      </div>
    </>
  )
}
