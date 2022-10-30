import NextHead from 'next/head'
import React, { Fragment } from 'react'
import { Gutter } from '../../components/Gutter'
import { ThemeProvider, useTheme } from '../../components/providers/Theme'
import { BlockSpacing } from '../../components/BlockSpacing'
import { StyleguideBreadcrumbs } from '.'
import { ArrowIcon } from '../../components/icons/ArrowIcon'
import { SearchIcon } from '../../components/icons/SearchIcon'

const IconsContent: React.FC = () => {
  return (
    <Fragment>
      <p>Icons</p>
      <div>
        <ArrowIcon />
        &nbsp;&nbsp;
        <SearchIcon />
      </div>
      <br />
      <p>Icons - bold</p>
      <div>
        <ArrowIcon bold />
        &nbsp;&nbsp;
        <SearchIcon bold />
      </div>
      <br />
      <p>Icons - Large</p>
      <div>
        <ArrowIcon size="large" />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <SearchIcon size="large" />
      </div>
      <br />
      <p>Icons - Large Bold</p>
      <div>
        <ArrowIcon bold size="large" />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <SearchIcon bold size="large" />
      </div>
    </Fragment>
  )
}

const Icons: React.FC = () => {
  const theme = useTheme()

  return (
    <Fragment>
      <NextHead>
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
        <title>Icons</title>
      </NextHead>
      <BlockSpacing style={{ marginTop: 'calc(var(--header-height) + var(--base)' }}>
        <Gutter>
          <StyleguideBreadcrumbs pageTitle="Icons" pageSlug="icons" />
          <h1>Icons</h1>
          <IconsContent />
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
              <IconsContent />
            </Gutter>
          </div>
        </ThemeProvider>
      </BlockSpacing>
    </Fragment>
  )
}

export default Icons
