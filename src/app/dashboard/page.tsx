import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'

export default async () => {
  return (
    <Gutter>
      <h2>Dashboard</h2>
      <Button appearance="primary" label="Create new project" href="/new" el="link" />
      <br />
      <br />
      <Button appearance="secondary" label="Logout" href="/logout" el="link" />
    </Gutter>
  )
}
