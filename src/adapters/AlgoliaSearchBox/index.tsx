import React, { useCallback, useEffect } from 'react'
import { useSearchBox } from 'react-instantsearch'

import useDebounce from '@root/utilities/use-debounce.js'

import classes from './index.module.scss'

const minValueLength = 3

export const AlgoliaSearchBox: React.FC<{
  className?: string
}> = props => {
  const { className } = props

  const {
    query,
    refine,
    clear,
    // isSearchStalled
  } = useSearchBox()

  const [value, setValue] = React.useState(query)
  const debouncedInput = useDebounce(value, 700)

  // TODO: allow outside changes to update this field (search modal)
  useEffect(() => {
    if (query !== debouncedInput) {
      // setValue(query);
    }
  }, [query, debouncedInput])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const incomingValue = e.target.value
      if (incomingValue !== value) {
        setValue(incomingValue)
      }
    },
    [value],
  )

  useEffect(() => {
    if (debouncedInput.length >= minValueLength) {
      refine(debouncedInput)
    } else if (debouncedInput.length < minValueLength) {
      clear()
    }
  }, [debouncedInput, refine, clear])

  return (
    <input
      {...props}
      type="text"
      className={[classes.algoliaSearchBox, className].filter(Boolean).join(' ')}
      value={value}
      onChange={handleChange}
    />
  )
}
