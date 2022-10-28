import NextHead from 'next/head'
import { Fragment } from 'react'
import { Gutter } from '../../components/Gutter'
import { ThemeProvider, useTheme } from '../../components/providers/Theme'
import { BlockSpacing } from '../../components/BlockSpacing'
import { StyleguideBreadcrumbs } from '.'

const TypographyContent: React.FC = () => {
  return (
    <Fragment>
      <h1>Typography</h1>
      <h1>H1: Lorem ipsum dolor sit amet officia deserunt.</h1>
      <h2>H2: Lorem ipsum dolor sit amet in culpa qui officia deserunt consectetur.</h2>
      <h3>
        H3: Lorem ipsum dolor sit amet in culpa qui officia deserunt consectetur adipiscing elit.
      </h3>
      <h4>
        H4: Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
      </h4>
      <h5>
        H5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
      </h5>
      <h6>
        H6: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
      </h6>
      <p>
        P: Lorem ipsum dolor sit amet, consectetur adipiscing elit consectetur adipiscing elit, sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua. dolore magna aliqua. Quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum
        dolor sit amet in culpa qui officia deserunt consectetur adipiscing elit.
      </p>
    </Fragment>
  )
}

const Typography: React.FC = () => {
  const theme = useTheme()

  return (
    <Fragment>
      <NextHead>
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
        <title>Typography</title>
      </NextHead>
      <BlockSpacing>
        <Gutter>
          <StyleguideBreadcrumbs pageTitle="Typography" pageSlug="typography" />
          <TypographyContent />
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
              <TypographyContent />
            </Gutter>
          </div>
        </ThemeProvider>
      </BlockSpacing>
    </Fragment>
  )
}

export default Typography
