'use client'

import React from 'react'

import Tooltip from '@components/Tooltip'
import Copy from '@root/icons/Copy'
import { EyeIcon } from '@root/icons/EyeIcon'
import useCopyToClipboard from '@root/utilities/use-copy-to-clipboard'
import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

const defaultValidate: Validate = val => {
  const stringVal = val as string
  const isValid = stringVal && stringVal.length > 0

  if (isValid) {
    return true
  }

  return 'Please enter a value.'
}

export const EnvInput: React.FC<
  FieldProps<string> & {
    endpoint: string
  }
> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    endpoint,
    onChange: onChangeFromProps,
    initialValue,
    className,
  } = props

  const [hasRevealed, setHasRevealed] = React.useState(false)
  const [hasFetched, setHasFetched] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const envRef = React.useRef<HTMLInputElement>(null)

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  const fetchEnvValue = async () => {
    try {
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      onChange(json.user.id)
      setHasFetched(true)
      return json.user.id
    } catch (e) {
      return null
    }
  }

  const onReveal = React.useCallback(async () => {
    const newValue = await fetchEnvValue()
    setHasRevealed(true)
    setIsVisible(true)
    onChange(newValue)
    envRef.current.focus()
  }, [onChange])

  const toggleVisibility = React.useCallback(async () => {
    if (!hasFetched) {
      await fetchEnvValue()
    }

    setIsVisible(!isVisible)
  }, [isVisible])

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <div className={classes.labelBar}>
        <Label htmlFor={path} label={label} required={required} />
        {endpoint && (
          <div className={classes.labelBarActions}>
            <ToggleVisibility onToggle={toggleVisibility} isVisible={isVisible} />
            <CopyAsyncValue getValue={fetchEnvValue} value={value} />
          </div>
        )}
      </div>

      <div className={classes.inputContainer}>
        <input
          className={classes.input}
          value={isVisible ? value : '*** *** *** *** *** *** *** *** *** *** *** *** *** ***'}
          onChange={e => {
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          type="text"
          id={path}
          name={path}
          required={required}
          ref={envRef}
          tabIndex={hasFetched ? 0 : -1}
        />
        {!hasRevealed && !hasFetched && (
          <button className={classes.revealButton} type="button" onClick={onReveal}>
            <label>reveal</label>
          </button>
        )}
      </div>
    </div>
  )
}

const ToggleVisibility: React.FC = ({ onToggle, isVisible }) => {
  const [isFocused, setIsFocused] = React.useState(false)

  const onInteraction = React.useCallback((dir: string) => {
    if (dir === 'enter') {
      setIsFocused(true)
    } else {
      setIsFocused(false)
    }
  }, [])

  return (
    <button
      onFocus={() => onInteraction('enter')}
      onBlur={() => onInteraction('leave')}
      onMouseEnter={() => onInteraction('enter')}
      onMouseLeave={() => onInteraction('leave')}
      className={[classes.toggleVisibility, isFocused && classes.isFocused]
        .filter(Boolean)
        .join(' ')}
      type="button"
      onClick={async () => onToggle()}
    >
      <EyeIcon />

      <Tooltip className={classes.iconTooltip}>{isVisible ? 'hide' : 'show'}</Tooltip>
    </button>
  )
}

const CopyAsyncValue = ({ getValue, value }) => {
  const [copied, setCopied] = React.useState(false)
  const [tooltip, setTooltip] = React.useState<'copied' | 'copy'>('copy')
  const [isFocused, setIsFocused] = React.useState(false)
  const [, copyTextFn] = useCopyToClipboard()

  const onMouseHover = React.useCallback((dir: string) => {
    if (dir === 'enter') {
      setIsFocused(true)
    } else {
      setIsFocused(false)
    }
  }, [])

  const copy = React.useCallback(async () => {
    copyTextFn(value || (await getValue()))
    setCopied(true)
    setTooltip('copied')
  }, [value])

  React.useEffect(() => {
    if (copied && !isFocused) {
      setCopied(false)
      setTimeout(() => {
        // css transition
        setTooltip('copy')
      }, 500)
    }
  }, [copied, isFocused])

  return (
    <button
      onFocus={() => onMouseHover('enter')}
      onBlur={() => onMouseHover('leave')}
      onMouseEnter={() => onMouseHover('enter')}
      onMouseLeave={() => onMouseHover('leave')}
      className={[
        classes.asyncCopyButton,
        copied ? classes.copied : '',
        isFocused && classes.isFocused,
      ]
        .filter(Boolean)
        .join(' ')}
      type="button"
      onClick={copy}
    >
      <Copy />

      <Tooltip className={classes.iconTooltip}>{tooltip}</Tooltip>
    </button>
  )
}
