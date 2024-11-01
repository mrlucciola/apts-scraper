const gqlQuery = `
query rental_info($id: ID!, $height: Int!, $width: Int!, $quality: Int!) {
  rental(id: $id) {
    id
    address {
      unit
      __typename
    }
    listingAddress: title_with_unit
    listingPrice: listed_price
    listingRooms: anyrooms_description
    listingBeds: bedrooms_description
    listingBaths: baths_description
    building {
      url
      __typename
    }
    source
    __typename
  }
  listedByList: rental_contacts(input: { rental_id: $id }) {
    business_name
    image {
      url(width: $width, height: $height, quality: $quality)
      __typename
    }
    industry_professional {
      headshot {
        url(width: $width, height: $height, quality: $quality)
        __typename
      }
      __typename
    }
    id
    is_pro
    name
    phone
    profile {
      url
    }
    license {
      id
      display_type
      __typename
    }
    __typename
  }
}
`;

export default gqlQuery;
