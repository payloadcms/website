import React from 'react'

export const useStarCount = (): string | undefined => {
  const [starCount, setStarCount] = React.useState<string | undefined>()

  React.useEffect(() => {
    const getStarCount = async (): Promise<void> => {
      const { stargazers_count: totalStars } = await fetch(
        'https://api.github.com/repos/payloadcms/payload',
      ).then(res => res.json())
      if (totalStars) setStarCount(totalStars.toLocaleString())
    }

    getStarCount()
  }, [])

  return starCount
}
