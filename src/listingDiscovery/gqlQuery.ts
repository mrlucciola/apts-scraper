const multiListingGqlQuery = `
query searchOrganicRentals($query: String) {
  search_organic_rentals(input: {
    limit: 500,
    query: $query
  }) {
    listing_id
    listing_type
    longitude
    latitude
    listed_price
    __typename
  }
}              
`;

export default multiListingGqlQuery;
