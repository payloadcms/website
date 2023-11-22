import React from 'react'

export const useStarCount = (): string | undefined => {
  const [starCount, setStarCount] = React.useState<string | undefined>()

  React.useEffect(() => {
    const getStarCount = async (): Promise<void> => {
      const { totalStars } = await fetch('/api/star-count', { next: { revalidate: 900 } }).then(
        res => res.json(),
      )
      if (totalStars) setStarCount(totalStars.toLocaleString())
    }

    getStarCount()
  }, [])

  return starCount
}
