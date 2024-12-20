import type { PayloadHandler } from 'payload'

const redeployWebsite: PayloadHandler = async (req) => {
  try {
    if (!process.env.VERCEL_REDEPLOY_URL) {
      // return res.status(400).json({ success: false, message: 'No Vercel redeploy URL found' })
      return new Response('No Vercel redeploy URL found', { status: 400 })
    }

    const triggerRedeploy = async () => {
      await fetch(process.env.VERCEL_REDEPLOY_URL || '', {
        method: 'POST',
      }).then((response) => response.json())
    }

    await triggerRedeploy()

    return new Response('Redeploy triggered', { status: 201 })
  } catch (error: unknown) {
    return new Response('Failed to trigger redeploy', { status: 500 })
  }
}

export default redeployWebsite
