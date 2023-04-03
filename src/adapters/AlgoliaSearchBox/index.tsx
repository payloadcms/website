import useDebounce from '@root/utilities/use-debounce'
import React, { useCallback, useEffect } from 'react'
import { useSearchBox } from 'react-instantsearch-hooks-web'
import classes from './index.module.scss'

export const AlgoliaSearchBox: React.FC<{
  className?: string
}> = props => {
  const { className } = props

  const {
    query,
    refine,
    // clear,
    // isSearchStalled
  } = useSearchBox()

  const [value, setValue] = React.useState(query)
  const debouncedInput = useDebounce(value, 150)

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
    if (debouncedInput.length >= 0) {
      refine(debouncedInput)
    }
  }, [debouncedInput, refine])

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
