import React from 'react'
import Link from 'next/link'
import { Gutter } from '../../components/Gutter'

const Styleguide: React.FC = () => {
  return (
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
        <br />
        <div>
          <Link href="/styleguide/fields">Fields</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/forms">Forms</Link>
        </div>
      </Gutter>
    </div>
  )
}

export default Styleguide
