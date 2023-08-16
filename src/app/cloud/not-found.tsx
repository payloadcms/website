import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'

export default function NotFound() {
  return (
    <Gutter>
      <h2>404</h2>
      <Button href={`/cloud`} label="Cloud home" appearance="primary" />
    </Gutter>
  )
}
