export const graphqlApiUrl = "https://api-internal.streeteasy.com/graphql";

export const viewerQuery = {
  operationName: "viewerQuery",
  variables: {},
  query: `query viewerQuery {
  viewer {
    email
    __typename
  }
}`,
};
