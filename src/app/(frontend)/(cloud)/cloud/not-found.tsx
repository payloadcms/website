import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'

export default function NotFound() {
  return (
    <Gutter>
      <h1>404</h1>
      <p>The page you are looking is not available.</p>
      <Button appearance="primary" el="link" href={`/cloud`} label="Cloud home" />
    </Gutter>
  )
}
