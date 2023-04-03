import dotenv from 'dotenv'

export default function handler(req, res) {
  dotenv.config()

  const communityHelpRequest = async () => {
    try {
      // Send a request to the custom endpoint
      await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/community-help/cron`, {
        headers: {
          'CRON-ENV-VAR': `${process.env.NEXT_PRIVATE_CRON_KEY}`,
        },
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  communityHelpRequest()

  res.status(200).end('Hello Community Help Cron!')
}
