import React from 'react'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { getDocPaths, getDoc, getTopics, Doc, Topic } from '../../../docs'
import { Gutter } from '../../../components/Gutter'
import classes from './index.module.scss'

type Params = {
  topic: string
  doc: string
}

type Props = {
  doc: Doc
  topics: Topic[]
}

type StaticPropsResult = {
  props: Props
}

const Docs: React.FC<Props> = props => {
  const { doc, topics } = props
  const {
    query: { doc: slug, topic },
  } = useRouter()

  return (
    <Gutter left="half" right="half" className={classes.wrap}>
      <nav className={classes.nav}></nav>
      <Grid className={classes.grid}>
        <Cell start={2} cols={8}>
          <h1 className={classes.title}>{doc.data.title}</h1>
        </Cell>
      </Grid>
    </Gutter>
  )
}

export async function getStaticProps({ params }: { params: Params }): Promise<StaticPropsResult> {
  const { topic, doc } = params
  const docToDisplay = await getDoc({ topic, doc })

  const topics = await getTopics()

  return {
    props: {
      doc: docToDisplay,
      topics,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getDocPaths()

  return {
    paths: paths.map(({ topic, doc }) => ({
      params: { topic, doc },
    })),
    fallback: false,
  }
}

export default Docs
