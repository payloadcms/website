import NextHead from 'next/head'
import React, { Fragment } from 'react'
import { Button } from '../../components/Button'
import { Gutter } from '../../components/Gutter'
import { ThemeProvider, useTheme } from '../../components/providers/Theme'
import { BlockSpacing } from '../../components/BlockSpacing'
import { StyleguideBreadcrumbs } from '.'

const ButtonContent: React.FC = () => {
  return (
    <Fragment>
      <p>Default</p>
      <div>
        <Button label="Learn more" />
      </div>
      <br />
      <p>Default with icon</p>
      <div>
        <Button label="Learn more" icon="arrow" />
      </div>
      <br />
      <p>Primary</p>
      <div>
        <Button appearance="primary" label="Create new project" />
      </div>
      <br />
      <p>Primary with icon</p>
      <div>
        <Button appearance="primary" label="Create new project" icon="arrow" />
      </div>
      <br />
      <p>Secondary</p>
      <div>
        <Button appearance="secondary" label="Read the docs" />
      </div>
      <br />
      <p>Secondary with icon</p>
      <div>
        <Button appearance="secondary" label="Read the docs" icon="arrow" />
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
      <BlockSpacing style={{ marginTop: 'calc(var(--header-height) + var(--base)' }}>
        <Gutter>
          <StyleguideBreadcrumbs pageTitle="Buttons" pageSlug="buttons" />
          <h1>Buttons</h1>
          <ButtonContent />
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
              <ButtonContent />
            </Gutter>
          </div>
        </ThemeProvider>
      </BlockSpacing>
    </Fragment>
  )
}

export default Buttons
