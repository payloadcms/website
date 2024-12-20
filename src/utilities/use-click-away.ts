import * as React from 'react'

export const useClickAway = (
  ref: React.MutableRefObject<HTMLElement | null>,
  onClickAway: (e: MouseEvent | TouchEvent) => void,
): void => {
  const savedCallback = React.useRef(onClickAway)

  React.useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  const clickAwayHandler = React.useCallback(
    (event: MouseEvent | TouchEvent): void => {
      const { current: el } = ref
      const targetElement = event.target
      if (targetElement) {
        if (el && !el.contains(targetElement as Node)) {
          savedCallback.current(event)
        }
      }
    },
    [ref],
  )

  React.useEffect(() => {
    document.addEventListener('mousedown', clickAwayHandler)
    document.addEventListener('touchstart', clickAwayHandler)

    return () => {
      document.removeEventListener('mousedown', clickAwayHandler)
      document.removeEventListener('touchstart', clickAwayHandler)
    }
  }, [clickAwayHandler])
}

export default useClickAway
