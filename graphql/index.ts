import { ApolloClient, InMemoryCache } from "@apollo/client";

let CLIENT: ApolloClient<unknown>

export function getApolloClient() {
  if (!CLIENT) {
    CLIENT = new ApolloClient({
      ssrMode: true,
      uri: process.env.NEXT_PUBLIC_CMS_URL,
      cache: new InMemoryCache(),
    });
  }

  return CLIENT;
}
