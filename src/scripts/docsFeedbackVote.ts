import type { PayloadHandler } from 'payload'

type VoteType = 'helpful' | 'notHelpful'

const docsFeedbackVote: PayloadHandler = async (req) => {
  try {
    const body = req.json ? await req.json() : {}
    const path = typeof body?.path === 'string' ? body.path.trim() : ''
    const vote = body?.vote as VoteType

    if (!path || (vote !== 'helpful' && vote !== 'notHelpful')) {
      return Response.json(
        { error: 'A valid `path` and `vote` ("helpful" | "notHelpful") are required.' },
        { status: 400 },
      )
    }

    // Atomic upsert + increment so concurrent votes don't clobber each other.
    // Goes through the underlying mongoose model directly (bypasses hooks, which
    // is fine for a counter).
    const model = (req.payload.db as any).collections['docs-feedback']
    await model.findOneAndUpdate(
      { path },
      { $inc: { [vote]: 1 }, $setOnInsert: { path } },
      { new: true, upsert: true },
    )

    return Response.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    req.payload.logger.error({ err: error, msg: 'docs-feedback vote failed' })
    return Response.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}

export default docsFeedbackVote
