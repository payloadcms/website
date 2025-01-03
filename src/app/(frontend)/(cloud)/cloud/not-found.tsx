import { Button } from '@components/Button/index.js'
import { Gutter } from '@components/Gutter/index.js'

export default function NotFound() {
  return (
    <Gutter>
      <h2>404</h2>
      <Button appearance="primary" href={`/cloud`} label="Cloud home" />
    </Gutter>
  )
}
