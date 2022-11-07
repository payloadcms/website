import React from 'react'
import Link from 'next/link'
import { Gutter } from '../../components/Gutter'

const Styleguide: React.FC = () => {
  return (
    <div>
      <Gutter>
        <h1>Styleguide</h1>
        <h4>Elements</h4>
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
        <br />
        <h4>Blocks</h4>
        <div>
          <Link href="/styleguide/blocks/form-block">Form Block</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/card-grid">Card Grid</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/hover-highlights">Hover Highlights</Link>
        </div>
        <br />
        <h4>Heros</h4>
        <div>
          <Link href="/styleguide/heros/form-hero">Form Hero</Link>
        </div>
      </Gutter>
    </div>
  )
}

export default Styleguide
