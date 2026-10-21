export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.info(`Node.js runtime version: ${process.version}`)
  }
}
