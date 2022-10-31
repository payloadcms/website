import React from 'react'
import Link from 'next/link'
import { Gutter } from '../../components/Gutter'
import { App } from '../App'

const Styleguide: React.FC = () => {
  return (
    <App>
      <div style={{ paddingTop: 'calc(var(--header-height) + var(--base)' }}>
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
          <br />
          <div>
            <Link href="/styleguide/highlight">Highlight</Link>
          </div>
        </Gutter>
      </div>
    </App>
  )
}

export default Styleguide
