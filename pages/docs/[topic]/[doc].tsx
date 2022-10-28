import React from 'react'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getDocPaths, getDoc, getTopics, Doc, Topic } from '../../../docs'

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

  return <h1>Docs</h1>
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
