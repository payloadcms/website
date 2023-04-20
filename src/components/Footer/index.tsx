'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import FormComponent from '@forms/Form'
import { validateEmail } from '@forms/validations'
import { ArrowIcon } from '@icons/ArrowIcon'
import { Footer as FooterType } from '@types'
import { usePathname, useRouter } from 'next/navigation'

import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { FacebookIcon } from '@root/graphics/FacebookIcon'
import { InstagramIcon } from '@root/graphics/InstagramIcon'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon'
import { TwitterIcon } from '@root/graphics/TwitterIcon'
import { YoutubeIcon } from '@root/graphics/YoutubeIcon'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { useThemePreference } from '@root/providers/Theme'
import { getImplicitPreference, themeLocalStorageKey } from '@root/providers/Theme/shared'
import { Theme } from '@root/providers/Theme/types'
import { getCookie } from '@root/utilities/get-cookie'

import classes from './index.module.scss'

export const Footer: React.FC<FooterType> = props => {
  const { columns } = props
  const [itemsUnderLogo, documentationItems] = columns ?? []
  const { setTheme, theme } = useThemePreference()
  const { setHeaderColor } = useHeaderTheme()
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const [buttonClicked, setButtonClicked] = React.useState(false)

  const submitButtonRef = React.useRef<HTMLButtonElement>(null)

  const handleButtonClick = () => {
    setButtonClicked(true)
  }

  React.useEffect(() => {
    const buttonElement = submitButtonRef.current

    if (buttonElement) {
      buttonElement.addEventListener('click', handleButtonClick)
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('click', handleButtonClick)
      }
    }
  }, [])

  const [formData, setFormData] = React.useState({ email: '' })

  const handleChange = e => {
    setFormData({ ...formData, [e.target?.name]: e.target?.value })
  }

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  const invalidEmail = validateEmail?.(formData.email) === 'Please enter a valid email address.'

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      const implicitPreference = getImplicitPreference()
      setHeaderColor(implicitPreference ?? 'light')
      setTheme(null)
    } else {
      setTheme(themeToSet)
      setHeaderColor(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
    }
  }, [])

  const router = useRouter()

  const pathname = usePathname()

  const onSubmit = React.useCallback(() => {
    setButtonClicked(false)
    const submitForm = async () => {
      setError(undefined)

      try {
        const formID = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ID
        const hubspotCookie = getCookie('hubspotutk')
        const pageUri = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
        const slugParts = pathname?.split('/')
        const pageName =
          slugParts && slugParts[slugParts.length - 1] === ''
            ? 'Home'
            : slugParts && slugParts[slugParts.length - 1]
        const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/form-submissions`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form: formID,
            submissionData: { field: 'email', value: formData.email },
            hubspotCookie,
            pageUri,
            pageName,
          }),
        })

        const res = await req.json()

        if (req.status >= 400) {
          setError({
            status: res.status,
            message: res.errors?.[0]?.message || 'Internal Server Error',
          })

          return
        }

        const url = '/thanks-for-subscribing'
        const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SITE_URL)

        try {
          if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SITE_URL) {
            router.push(redirectUrl.href)
          } else {
            window.location.assign(url)
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setError({
            message: 'Something went wrong. Did not redirect.',
          })
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setError({
          message: 'Newsletter form submission failed.',
        })
      }
    }
    submitForm()
  }, [pathname, formData, router])

  if (Array.isArray(itemsUnderLogo?.navItems) && Array.isArray(documentationItems?.navItems)) {
    return (
      <footer className={classes.footer}>
        <Gutter>
          <Grid>
            <Cell cols={3} colsM={4}>
              <div className={classes.colHeader}>
                <div className={classes.payloadIcon}>
                  <PayloadIcon />
                </div>
              </div>

              <div>
                {itemsUnderLogo.navItems.map(({ link }, index) => {
                  return <CMSLink key={index} className={classes.link} {...link} />
                })}
              </div>
            </Cell>

            <Cell cols={4} colsM={4}>
              <p className={classes.colHeader}>Documentation</p>
              <div className={classes.col2Items}>
                {documentationItems?.navItems.map(({ link }, index) => {
                  return (
                    <React.Fragment key={index}>
                      <CMSLink className={classes.link} {...link} />
                    </React.Fragment>
                  )
                })}
              </div>
            </Cell>

            <Cell cols={5} colsM={6} colsS={8}>
              <p className={`${classes.colHeader} ${classes.thirdColumn}`}>Stay connected</p>
              <div>
                {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
                <FormComponent onSubmit={onSubmit}>
                  <div className={classes.inputWrap}>
                    <Text
                      type="text"
                      path="email"
                      value={formData.email}
                      customOnChange={handleChange}
                      required
                      validate={validateEmail}
                      className={classes.emailInput}
                      placeholder="Enter your email"
                    />
                    <ArrowIcon
                      className={[
                        classes.inputArrow,
                        buttonClicked && invalidEmail && classes.invalidEmailArrow,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  </div>

                  <div className={classes.subscribeAction}>
                    <p className={classes.subscribeDesc}>
                      Sign up to receive periodic updates and feature releases to your email.
                    </p>
                    <button ref={submitButtonRef} className={classes.ok} type="submit">
                      OK
                    </button>
                  </div>
                </FormComponent>
              </div>
            </Cell>
          </Grid>

          <Grid className={classes.footerMeta}>
            <Cell cols={3} colsM={5}>
              <div className={classes.socialLinks}>
                <a
                  href="https://www.instagram.com/payloadcms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCyrx4Wpd4SBIpqUKlkb6N1Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <YoutubeIcon />
                </a>
                <a
                  href="https://twitter.com/payloadcms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <TwitterIcon />
                </a>
                <a
                  href="https://www.facebook.com/payloadcms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <FacebookIcon />
                </a>
              </div>
            </Cell>

            <Cell cols={4} colsM={8}>
              <p
                className={classes.copyright}
              >{`Copyright ${new Date().getFullYear()} Payload CMS, Inc.`}</p>
            </Cell>

            <Cell cols={2} colsM={8} className={classes.themeCell}>
              <div className={classes.selectContainer}>
                <label htmlFor="theme">
                  <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
                    {!theme && <ThemeAutoIcon />}
                    {theme === 'light' && <ThemeLightIcon />}
                    {theme === 'dark' && <ThemeDarkIcon />}
                  </div>

                  <select
                    id="theme"
                    onChange={e => onThemeChange(e.target.value as Theme & 'auto')}
                    ref={selectRef}
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>

                  <ChevronUpDownIcon
                    className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`}
                  />
                </label>
              </div>
            </Cell>
          </Grid>
        </Gutter>
      </footer>
    )
  }

  return null
}
