import { Cell, Grid } from '@faceless-ui/css-grid'

import Code from '@components/Code'
import { Media } from '@components/Media'
import { PixelBackground } from '@components/PixelBackground'
import { CodeExampleBlock, ExampleTabsBlock, MediaExampleBlock } from '@root/payload-types'

import classes from './index.module.scss'

type Props = {
  examples: ExampleTabsBlock['tabs'][0]['examples']
}

export const CodeExample: React.FC<CodeExampleBlock> = ({ code }) => {
  return (
    <Cell cols={6} colsM={4} colsS={8} className={classes.codeExample}>
      <div className={classes.codeWrap}>{code && <Code>{code}</Code>}</div>
    </Cell>
  )
}

export const MediaExample: React.FC<MediaExampleBlock> = ({ media }) => {
  return (
    <Cell cols={6} colsM={4} colsS={8} className={classes.mediaExample}>
      {media && typeof media !== 'string' && <Media resource={media} />}
    </Cell>
  )
}

export const Examples: React.FC<Props> = props => {
  const { examples } = props

  return (
    <Grid className={classes.examples}>
      {Array.isArray(examples) &&
        examples.map((example, i) => {
          if (example.blockType === 'CodeExampleBlock') {
            return <CodeExample key={i} {...example} />
          } else if (example.blockType === 'MediaExampleBlock') {
            return <MediaExample key={i} {...example} />
          }
        })}
      <div className={classes.bg}>
        <PixelBackground />
      </div>
    </Grid>
  )
}
