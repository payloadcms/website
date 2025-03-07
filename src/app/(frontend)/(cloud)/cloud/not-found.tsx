import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'

export default function NotFound() {
  return (
    <Gutter>
      <h2>404</h2>
      <Button appearance="primary" href={`/cloud`} label="Cloud home" />
    </Gutter>
  )
}
