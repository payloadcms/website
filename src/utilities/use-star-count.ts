import React from 'react'

export const useStarCount = (): string | undefined => {
  const [starCount, setStarCount] = React.useState<string | undefined>()

  React.useEffect(() => {
    const getStarCount = async (): Promise<void> => {
      const { totalStars } = await fetch('/api/star-count', { next: { revalidate: 900 } }).then(
        (res) => res.json(),
      )
      if (totalStars) {
        if (totalStars > 1000) {
          setStarCount((totalStars / 1000).toFixed(1) + 'k')
        } else {
          setStarCount(totalStars.toLocaleString())
        }
      }
    }

    void getStarCount()
  }, [])

  return starCount
}
