import { Button } from '../../components/Button'
import NextHead from 'next/head'
import { Fragment } from 'react'
import { Gutter } from '../../components/Gutter'
import { ThemeProvider, useTheme } from '../../components/providers/Theme'
import { BlockSpacing } from '../../components/BlockSpacing'
import { StyleguideBreadcrumbs } from '.'
import { ArrowIcon } from '../../components/icons/ArrowIcon'

const IconsContent: React.FC = () => {
  return (
    <Fragment>
      <p>
        Icons
      </p>
      <div>
        <ArrowIcon />
      </div>
      <br />
      <p>
        Icons - bold
      </p>
      <div>
        <ArrowIcon bold />
      </div>
      <br />
      <p>
        Icons - Large
      </p>
      <div>
        <ArrowIcon size="large" />
      </div>
      <br />
      <p>
        Icons - Large Bold
      </p>
      <div>
        <ArrowIcon bold size="large" />
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
      <BlockSpacing>
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
