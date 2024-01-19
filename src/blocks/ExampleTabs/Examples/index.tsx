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
    <div className={[classes.codeExample, 'cols-8 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
      <div className={classes.codeWrap}>{code && <Code>{code}</Code>}</div>
    </div>
  )
}

export const MediaExample: React.FC<MediaExampleBlock> = ({ media }) => {
  return (
    <div className={[classes.mediaExample, 'cols-8 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
      {media && typeof media !== 'string' && <Media resource={media} />}
    </div>
  )
}

export const Examples: React.FC<Props> = props => {
  const { examples } = props

  return (
    <div className={[classes.examples, 'grid'].filter(Boolean).join(' ')}>
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
    </div>
  )
}
