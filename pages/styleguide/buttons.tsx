import { Button } from '../../components/Button'
import NextHead from 'next/head'
import { Fragment } from 'react'
import { Gutter } from '../../components/Gutter'
import { ThemeProvider, useTheme } from '../../components/providers/Theme'
import { BlockSpacing } from '../../components/BlockSpacing'
import { StyleguideBreadcrumbs } from '.'

const ButtonContent: React.FC = () => {
  return (
    <Fragment>
      <div>
        <Button label="Lorem ipsum" />
      </div>
      <div>
        <Button appearance="default" label="Lorem ipsum" />
      </div>
      <div>
        <Button appearance="primary" label="Lorem ipsum" />
      </div>
      <div>
        <Button appearance="secondary" label="Lorem ipsum" />
      </div>
    </Fragment>
  )
}

const Buttons: React.FC = () => {
  const theme = useTheme()

  return (
    <Fragment>
      <NextHead>
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
        <title>Buttons</title>
      </NextHead>
      <BlockSpacing>
        <Gutter>
          <StyleguideBreadcrumbs pageTitle="Buttons" pageSlug="buttons" />
          <h1>Buttons</h1>
          <ButtonContent />
        </Gutter>
      </BlockSpacing>
      <BlockSpacing
        style={{
          backgroundColor: 'var(--color-base-900)',
          padding: `calc(var(--base) * 2) 0`,
        }}
      >
        <ThemeProvider theme={theme === 'dark' ? 'light' : 'dark'}>
          <Gutter>
            <ButtonContent />
          </Gutter>
        </ThemeProvider>
      </BlockSpacing>
    </Fragment>
  )
}

export default Buttons
