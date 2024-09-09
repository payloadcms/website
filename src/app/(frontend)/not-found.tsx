import { ErrorMessage } from '@components/ErrorMessage/index.js'
import { Footer } from '@components/Footer/index.js'
import { Header } from '@components/Header/index.js'
import { fetchGlobals } from '@data/index.js'

export default async function NotFound() {
  const { mainMenu, footer } = await fetchGlobals()

  return (
    <>
      <Header {...mainMenu} />
      <div>
        <ErrorMessage />
        <div id="docsearch" />
        <Footer {...footer} />
      </div>
    </>
  )
}
