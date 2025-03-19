'use client'

import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Styleguide: React.FC = () => {
  return (
    <div>
      <Gutter>
        <Heading marginTop={false}>Styleguide</Heading>
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
        <div>
          <Link href="/styleguide/cards">Cards</Link>
        </div>
        <br />
        <h4>Blocks</h4>
        <div>
          <Link href="/styleguide/blocks/banner-block">Banner Block</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/form-block">Form Block</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/card-grid">Card Grid</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/content-grid">Content Grid</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/hover-highlights">Hover Highlights</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/media-content">Media Content</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/call-to-action">Call To Action</Link>
        </div>
        <br />
        <div>
          <Link href="/styleguide/blocks/link-grid">Link Grid</Link>
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
