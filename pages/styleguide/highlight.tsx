import NextHead from 'next/head'
import React, { Fragment } from 'react'
import { Gutter } from '../../components/Gutter'
import { ThemeProvider, useTheme } from '../../components/providers/Theme'
import { BlockSpacing } from '../../components/BlockSpacing'
import { StyleguideBreadcrumbs } from '.'
import RichText from '../../components/RichText'

const richText = [
  {
    type: 'h1',
    children: [
      {
        text: 'App frameworks give you a backend, but lack CMS-grade UI. ',
      },
      {
        text: 'Payload gives you both.',
        underline: true,
      },
      {
        text: ' Extend everything, build anything.',
      },
    ],
  },
  {
    type: 'p',
    children: [
      {
        text: 'Payload is much more than a CMS—it’s just as much a CMS as it is an application framework. Its extensibility allows it to power everything from enterprise websites to native apps. It’ll never hold you back.',
      },
    ],
  },
]

const HighlightContent: React.FC = () => {
  return (
    <Fragment>
      <RichText content={richText} />
    </Fragment>
  )
}

const Highlight: React.FC = () => {
  const theme = useTheme()

  return (
    <Fragment>
      <NextHead>
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
        <title>Highlight</title>
      </NextHead>
      <BlockSpacing style={{ marginTop: 'calc(var(--header-height) + var(--base)' }}>
        <Gutter>
          <StyleguideBreadcrumbs pageTitle="Highlight" pageSlug="highlight" />
          <h1>Highlight</h1>
          <HighlightContent />
        </Gutter>
      </BlockSpacing>
      <BlockSpacing>
        <ThemeProvider theme={theme === 'dark' ? 'light' : 'dark'}>
          <div
            style={{
              backgroundColor: 'var(--theme-elevation-0)',
              padding: `calc(var(--base) * 2) 0`,
            }}
          >
            <Gutter>
              <HighlightContent />
            </Gutter>
          </div>
        </ThemeProvider>
      </BlockSpacing>
    </Fragment>
  )
}

export default Highlight
