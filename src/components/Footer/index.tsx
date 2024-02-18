'use client'

import React from 'react'
import { Text } from '@forms/fields/Text'
import FormComponent from '@forms/Form'
import { validateEmail } from '@forms/validations'
import { ArrowIcon } from '@icons/ArrowIcon'
import { Footer as FooterType } from '@types'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Demo } from '@components/Payload3D'
import { FacebookIcon } from '@root/graphics/FacebookIcon'
import { InstagramIcon } from '@root/graphics/InstagramIcon'
import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon'
import { TwitterIconAlt } from '@root/graphics/TwitterIconAlt'
import { YoutubeIcon } from '@root/graphics/YoutubeIcon'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver'
import { useThemePreference } from '@root/providers/Theme'
import { getImplicitPreference, themeLocalStorageKey } from '@root/providers/Theme/shared'
import { Theme } from '@root/providers/Theme/types'
import { getCookie } from '@root/utilities/get-cookie'

import classes from './index.module.scss'

export const Footer: React.FC<FooterType> = props => {
  const { columns } = props
  const [products, developers, company] = columns ?? []
  const { setTheme } = useThemePreference()
  const { setHeaderTheme } = useHeaderObserver()
  const wrapperRef = React.useRef<HTMLElement>(null)
  const backgroundRef = React.useRef<HTMLDivElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)
  const { scrollYProgress } = useScroll()
  const translateYRaw = useTransform(scrollYProgress, [0, 1], [-300, 0], { clamp: true })
  const translateY = useSpring(translateYRaw, { bounce: 0 })

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
      const implicitPreference = getImplicitPreference() ?? 'light'
      setHeaderTheme(implicitPreference)
      setTheme(implicitPreference)
      if (selectRef.current) selectRef.current.value = 'auto'
    } else {
      setTheme(themeToSet)
      setHeaderTheme(themeToSet)
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
        const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
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

  return (
    <footer ref={wrapperRef} className={classes.footer} data-theme="dark">
      <motion.div
        ref={backgroundRef}
        className={classes.background}
        initial={{ y: -300 }}
        style={{ y: translateY }}
      >
        <Image alt="" src="/images/footer-bg.jpg" width={1920} height={1068} />
      </motion.div>
      <BackgroundGrid zIndex={0} />
      <Gutter className={classes.container}>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>Products</p>
            <div className={classes.colItems}>
              {products?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>Documentation</p>
            <div className={classes.colItems}>
              {developers?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>Company</p>
            <div className={classes.colItems}>
              {company?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
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
                  <button ref={submitButtonRef} className={classes.submitButton} type="submit">
                    <ArrowIcon className={[classes.inputArrow].filter(Boolean).join(' ')} />
                  </button>
                </div>

                <div className={classes.subscribeAction}>
                  <p className={classes.subscribeDesc}>
                    Sign up to receive periodic updates and feature releases to your email.
                  </p>
                </div>
              </FormComponent>
            </div>

            <div className={classes.socialLinks}>
              <a
                href="https://www.instagram.com/payloadcms/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's Instagram page"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/UCyrx4Wpd4SBIpqUKlkb6N1Q"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's YouTube channel"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://twitter.com/payloadcms"
                target="_blank"
                rel="noopener noreferrer"
                className={`${classes.socialIconLink} ${classes.twitterIcon}`}
                aria-label="Payload's Twitter page"
              >
                <TwitterIconAlt />
              </a>
              <a
                href="https://www.facebook.com/payloadcms/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's Facebook page"
              >
                <FacebookIcon />
              </a>
            </div>

            <div className={classes.selectContainer}>
              <label htmlFor="theme">
                {selectRef?.current && (
                  <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
                    {selectRef.current.value === 'auto' && <ThemeAutoIcon />}
                    {selectRef.current.value === 'light' && <ThemeLightIcon />}
                    {selectRef.current.value === 'dark' && <ThemeDarkIcon />}
                  </div>
                )}

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
          </div>
        </div>
        {/* <Demo /> */}
      </Gutter>
    </footer>
  )
}
