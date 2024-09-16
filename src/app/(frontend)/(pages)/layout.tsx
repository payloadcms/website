import { Footer } from '@components/Footer/index.js'
import { Header } from '@components/Header/index.js'
import { fetchGlobals } from '@data/index.js'

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
