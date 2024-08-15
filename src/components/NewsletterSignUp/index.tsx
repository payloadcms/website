import React, { useId } from 'react'
import FormComponent from '@forms/Form/index.js'
import { validateEmail } from '@forms/validations.js'
import { Text } from '@forms/fields/Text/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { usePathname, useRouter } from 'next/navigation'
import { getCookie } from '@root/utilities/get-cookie.js'

import classes from './index.module.scss'
import { ErrorIcon } from '@root/icons/ErrorIcon'

interface NewsletterSignUpProps {
  className?: string
  placeholder?: string
  description?: string | false
}

export const NewsletterSignUp: React.FC<NewsletterSignUpProps> = props => {
  const {
    className,
    placeholder = 'Enter your email',
    description = 'Sign up to receive periodic updates and feature releases to your email.',
  } = props

  const [buttonClicked, setButtonClicked] = React.useState(false)
  const [formData, setFormData] = React.useState({ email: '' })
  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  const submitButtonRef = React.useRef<HTMLButtonElement>(null)

  const newsletterId = useId()
  const pathname = usePathname()
  const router = useRouter()

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

  const handleButtonClick = () => {
    setButtonClicked(true)
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target?.name]: e.target?.value })
  }

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
    <div className={[className, classes.newsletterSignUp].filter(Boolean).join(' ')}>
      {error && <div className={classes.errorWrap}>{`${error.message || ''}`}</div>}
      <FormComponent onSubmit={onSubmit}>
        <div className={classes.inputWrap}>
          <label className="visually-hidden" htmlFor={newsletterId}>
            Subscribe to our newsletter
          </label>
          <Text
            type="text"
            path={newsletterId}
            name="email"
            value={formData.email}
            customOnChange={handleChange}
            required
            validate={validateEmail}
            className={classes.emailInput}
            placeholder={placeholder}
          />
          <button
            ref={submitButtonRef}
            className={classes.submitButton}
            type="submit"
            disabled={!formData.email}
          >
            <ArrowIcon className={[classes.inputArrow].filter(Boolean).join(' ')} />
            <span className="visually-hidden">Submit</span>
          </button>
        </div>

        <div className={classes.subscribeAction}>
          <p className={classes.subscribeDesc}>{description}</p>
        </div>
      </FormComponent>
    </div>
  )
}
