import dotenv from 'dotenv'
import { PayloadHandler } from 'payload/config'

dotenv.config()

const redeployWebsite: PayloadHandler = async (req, res) => {
  try {
    if (!process.env.VERCEL_REDEPLOY_URL) {
      return res.status(400).json({ success: false, message: 'No Vercel redeploy URL found' })
    }

    const triggerRedeploy = async () => {
      await fetch(process.env.VERCEL_REDEPLOY_URL, {
        method: 'POST',
      }).then(response => response.json())
    }

    await triggerRedeploy()

    return res.status(201).json({ success: true, message: 'Redeploy triggered' })
  } catch (error: unknown) {
    return res.status(500).json({ success: false, message: 'Failed to trigger redeploy' })
  }
}

export default redeployWebsite
