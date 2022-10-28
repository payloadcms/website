import NextHead from 'next/head'
import { Fragment } from 'react'
import Link from 'next/link'
import { Gutter } from '../../components/Gutter'

export const StyleguideBreadcrumbs: React.FC<{
  pageTitle: string
  pageSlug: string
}> = ({ pageTitle, pageSlug }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Link href="/styleguide">Styleguide</Link>
      &nbsp;{'>'}&nbsp;
      <Link href={`/styleguide/${pageSlug}`}>{pageTitle}</Link>
    </div>
  )
}

const Styleguide: React.FC = () => {
  return (
    <Fragment>
      <NextHead>
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
        <title>Styleguide</title>
      </NextHead>
      <Gutter>
        <h1>Styleguide</h1>
        <div>
          <Link href="/styleguide/icons">Icons</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/buttons">Buttons</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/typography">Typography</Link>
        </div>
      </Gutter>
    </Fragment>
  )
}

export default Styleguide
