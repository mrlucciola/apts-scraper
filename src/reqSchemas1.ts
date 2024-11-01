/**
 * 

https://streeteasy.com/building/78-west-3-street-new_york/2a
*/

import { z } from "zod";

const graphql_endpoint = "https://api-internal.streeteasy.com/graphql";

const aaa = [
  {
    "@context": "http://schema.org",
    "@type": "Apartment",
    address: "78 West 3rd Street #2A",
    amenityFeature: [
      { name: "Dishwasher", value: true },
      { name: "Washer / Dryer in Unit", value: true },
      { name: "Private Outdoor Space", value: true },
      { name: "Verizon FiOS Enabled", value: true },
      { name: "Central Air", value: true },
      { name: "Hardwood Floors", value: true },
      { name: "Terrace", value: true },
    ],
    photo: {
      "@type": "ImageObject",
      contentUrl:
        "https://photos.zillowstatic.com/fp/7160344905bcf13ddfc16b0ad62bc964-se_medium_500_250.webp",
    },
    description:
      "Greenwich Village loft perfection. 3 bedroom and 2 bathroom generously proportioned full floor loft with a private outdoor space off the kitchen. This elegant residence features a chef’s kitchen, spacious private terrace, 2 bedrooms with custom closets and a master bedroom with en suite bathroom. Apartment has its own washer/dryer. Located in 78 West 3rd Street a boutique 4 unit rental building in Greenwich Village. This modern rental building features unique luxury apartments ranging from 1 bedrooms to 3 bedrooms. The sleek facade of the building features the original brick fused with copper. Located at the crossroads of downtown with easy access to the Subway, NYU, Washington Square Park and so much more.\n\nPlease no pets, this apartment has a broker's fee.",
    numberOfRooms: 3.0,
  },
];

const AmenityFeat = z.object({
  name: z.string(),
  value: z.boolean().catch(true),
});
const Photo = z.object({
  /** "ImageObject" */
  "@type": z.string(),
  /** "https://photos.zillowstatic.com/fp/7160344905bcf13ddfc16b0ad62bc964-se_medium_500_250.webp" */
  contentUrl: z.string().url(),
});

const StreetEasyAddlInfoItem = z.object({
  /** "http://schema.org" */
  "@context": z.string().url(),
  /** "Apartment" */
  "@type": z.string(),
  /** "78 West 3rd Street #2A" */
  address: z.string(),
  /** { name: "Dishwasher", value: true } */
  amenityFeature: z.array(AmenityFeat),
  photo: Photo,
  /** "Greenwich Village loft perfection. 3 bedroom and 2 bathroom generously proportioned full floor loft with a private outdoor space off the kitchen. This elegant residence features a chef’s kitchen, spacious private terrace, 2 bedrooms with custom closets and a master bedroom with en suite bathroom. Apartment has its own washer/dryer. Located in 78 West 3rd Street a boutique 4 unit rental building in Greenwich Village. This modern rental building features unique luxury apartments ranging from 1 bedrooms to 3 bedrooms. The sleek facade of the building features the original brick fused with copper. Located at the crossroads of downtown with easy access to the Subway, NYU, Washington Square Park and so much more.\n\nPlease no pets, this apartment has a broker's fee." */
  description: z.string(),
  /** 3.0 */
  numberOfRooms: z.number(),
});

const StreetEasyAddlInfo = z.array(StreetEasyAddlInfoItem);
