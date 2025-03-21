export async function POST(request: Request) {
  const { captchaValue } = await request.json()

  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PRIVATE_RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
    {
      method: 'POST',
    },
  )
  const data = await res.json()

  return Response.json({ ...data })
}
