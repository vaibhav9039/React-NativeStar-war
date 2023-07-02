import { ApolloClient, InMemoryCache } from "@apollo/client";

const SWAPI_GRAPHQL_API =
  "https://swapi-graphql.netlify.app/.netlify/functions/index";

const client = new ApolloClient({
  uri: SWAPI_GRAPHQL_API,
  cache: new InMemoryCache(),
});

export default client;
