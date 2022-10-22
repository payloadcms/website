import { GetStaticProps, GetStaticPaths } from 'next'
import { getApolloClient } from '../graphql';
import { PAGE, PAGES } from '../graphql/pages';
import type { Footer, MainMenu, Page } from '../payload-types';

const PageTemplate: React.FC<{
  page: Page
  mainMenu: MainMenu
  footer: Footer
  preview?: boolean
}> = (props) => {
  const {
    page: { title },
    mainMenu,
    footer,
  } = props;

  return (
    <h1>{title}</h1>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = getApolloClient();
  const slug = params?.slug || 'home';

  const { data } = await apolloClient.query({
    query: PAGE,
    variables: {
      slug,
    },
  });

  if (!data.Pages.docs[0]) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page: data.Pages.docs[0],
      mainMenu: data.MainMenu,
      footer: data.Footer,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = getApolloClient();

  const { data } = await apolloClient.query({
    query: PAGES,
  });

  return {
    paths: data.Pages.docs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  };
}

export default PageTemplate;
