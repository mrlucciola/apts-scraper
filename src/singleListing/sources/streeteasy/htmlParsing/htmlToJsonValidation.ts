import { z } from "zod";
import { ListingIdField } from "../../../../general/commonValidation";
import { zDayjs, zUrl } from "../../../../utils/zod";
import { Amenities } from "../../../../streeteasyUtils/interfaces";
import { RentalHistoryStatus } from "../../../../db/models/rentalHistory";
import { AddressDb } from "../../../../db/models/address";

// 1. Validate text from within script tag
//

/**
 * ### Input:
 * `{ a: ["$", "$L18", null, { TARGET }] }`
 *
 * ### After transform:
 * `{ TARGET }`
 */
export const FinalPreprocessSchema = z
  .object({
    a: z.tuple([z.any(), z.any(), z.any(), z.object({}).passthrough()]),
  })
  .transform((arg, _ctx) => arg.a[3]);

// const jsonFromScript = ScriptInnerTextSchema.parse("");
// const parentWithArrayJson = InitTwoElemArraySchema.parse(jsonFromScript);
// FinalPreprocessSchema.parse(parentWithArrayJson);

const UnimportantFields = z.object({
  children: z.array(z.any()).nullish(), // @deprecated
  breadcrumbs: z.array(z.any()).nullish(), // @todo INCOMPLETE ARRAY
  deeplinkBannerProps: z.string().nullish(), // "$34",
  fingerprint: z.string().nullish(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
  isClickStreamEnabled: z.boolean().nullish(),
  isHidden: z.boolean().nullish(), // false,
  isMobile: z.boolean().nullish(), // false,
  isSaved: z.boolean().nullish(), // false,
  oneTrustDomainID: z.string().nullish(), // "59a0e49e-51ff-45ca-a44f-e17efedb931e-test",
  skipAds: z.boolean().nullish(), // false,
  userSignedIn: z.boolean().nullish(), // false,
  agentFolders: z.array(z.any()).nullish(), // [], // @todo INCOMPLETE ARRAY
  //
  viewer: z.object({}).passthrough(), // @todo INCOMPLETE OBJECT
  //
  listingType: z.string(), // @todo INCOMPLETE ENUM
  nearMeListingType: z.string(), // "rental", @todo INCOMPLETE ENUM
});

/** P+1 level JSON Schemas */
const HeaderDataSchema = z
  .object({
    account_tools: z.object({
      advertise_dropdown_links: z.array(z.any()).nullish(),
      advertise_total_count: z.number().nullish(),
      advertise_url: zUrl,
      new_connections_count: z.number().nullish(),
    }),
    main_navigation: z.object({
      seller_dashboard_sale_id: z.any().nullish(),
      show_owner_dashboard_link: z.boolean().nullish(),
      show_seller_dashboard_link: z.boolean().nullish(),
      popular_buildings_cache_expiration_link: z.any().nullish(),
      popular_buildings: z
        .array(z.object({ url_for_building: zUrl.nullish(), subject: z.string().nullish() }))
        .nullish(),
      latest_blogs: z.array(z.any()).nullish(),
      popular_blogs: z.array(z.object({ title: z.string().nullish(), url: zUrl.nullish() })),
      popular_agent_resources: z.array(z.any()).nullish(),
    }),
    current_user: z.any().nullish(),
    cart_abandoned: z.boolean().nullish(),
    tools_title_for_user: z.any().nullish(),
    masquerader: z.any().nullish(),
    masquerader_login: z.any().nullish(),
    can_view_homepage_featured_listings_dashboard: z.boolean().nullish(),
    has_admin: z.boolean().nullish(),
    has_advertise_dropdown: z.boolean().nullish(),
    has_advertise_link: z.boolean().nullish(),
    has_account_tools_dropdown: z.boolean().nullish(),
    has_agent_tools_dropdown: z.boolean().nullish(),
    has_experts_dropdown: z.boolean().nullish(),
    has_my_activity: z.boolean().nullish(),
    has_owner_tools: z.boolean().nullish(),
    has_paid_listing_tools: z.boolean().nullish(),
    has_seller_landing_page: z.boolean().nullish(),
    has_universal_partner_experience: z.boolean().nullish(),
    homepage_featured_listings_slot_available: z.boolean().nullish(),
    agent_tools_links_prefix: z.string().nullish(), // "industry-tools", @note may be an enum
    has_upx_billing_page: z.boolean().nullish(),
    has_upx_profile_page: z.boolean().nullish(),
    /** @deprecated unimmportant */
    deeplink_banner_props: z
      .object({
        button_text: z.string().nullish(),
        component: z.string().nullish(),
        description: z.string().nullish(),
        event_location: z.string().nullish(),
        url: zUrl,
      })
      .nullish(),
    is_mobile: z.boolean().nullish(),
    show_main_nav: z.boolean().nullish(),
    cms_segments: z.array(z.string()).nullish(), //["anonymous"],
    signed_in: z.boolean().nullish(),
  })
  .passthrough();

const BuildingSchema = z.object({
  se: z.object({ id: z.string(), areaId: z.number() }), // {id: "8108", areaId: 117}
  id: ListingIdField, // "8108",
  slug: z.string().nullish(), // "the-mayfair-145-4th-avenue-new_york",
  area: z.object({
    id: z.string().nullish(), // "east-village",
    name: z.string().nullish(), // "East Village",
    description: z.string().nullish(), // "Known and loved for being the birthplace of punk rock, the East Village is known for its vibrant restaurants and cocktail dens. During the day, however, the neighborhood slows down and has a tranquil feel. Meander down a leafy side street, and you'll happen upon plenty of prewar buildings and rusting fire escapes, which lend the East Village its old-fashioned charm.",
    breadcrumbs: z.array(
      z.object({
        urlPart: z.string().nullish(), // "manhattan",
        name: z.string().nullish(), // "Manhattan",
      })
    ),
    neighborhoodsBlogSlug: z.string().nullish(), // "east-village",
    relatedAreas: z.array(
      z.object({
        id: z.string().nullish(), // "lower-east-side",
        name: z.string().nullish(), // "Lower East Side",
        neighborhoodsBlogSlug: z.string().nullish(), // "lower-east-side",
        slug: z.string().nullish(), // "les",
      })
    ),
    slug: z.string().nullish(), // "east-village",
  }),
  geoCenter: z
    .object({
      latitude: z.number().nullish(), // 40.733856,
      longitude: z.number().nullish(), // -73.989555,
    })
    .nullish(),
  policies: z.object({
    list: z.array(z.string()), // @note - "PETS_ALLOWED"
    petPolicy: z
      .object({
        catsAllowed: z.any().nullish(),
        dogsAllowed: z.any().nullish(),
      })
      .nullish(),
  }),
  type: z.string().nullish(), // "Rental unit",
  additionalDetails: z.object({
    leasingStartDate: z.any().nullish(),
    salesStartDate: z.any().nullish(),
  }),
  status: z.union([z.string(), z.enum(["COMPLETED"])]).nullish(), // @note Enum - "COMPLETED",
  /** @deprecated seems to be specific to just nyc */
  nyc: z.object({
    abatementExpiration: z.any().nullish(),
    abatementType: z.any().nullish(),
    hasAbatements: z.boolean().nullish(),
  }),
  address: z.object({
    city: z.string().nullish(), // "NEW YORK",
    state: z.string().nullish(), // "NY",
    street: z.string().nullish(), // "145 4th Avenue",
    zipCode: z.string().nullish(), // "10003",
  }),
  complex: z.any().nullish(), // null,
  name: z.string().nullish(), // "The Mayfair",
  floorCount: z.number(), // 17,
  residentialUnitCount: z.number(), // 209,
  yearBuilt: z.number(), // 1964,
  rentalInventorySummary: z.object({
    availableListingDigests: z.array(z.object({ id: z.string() })), // {id: "4675935"}
  }),
  saleInventorySummary: z.object({ availableListingDigests: z.array(z.any()).nullish() }),
  nearby: z.object({
    /** [{ name: "14th St-Union Square", routes: ["L", "N", "Q", "R", "W", "4", "5", "6"], distance: 0.0224 }] */
    transitStations: z.array(
      z.object({ name: z.string().nullish(), routes: z.array(z.string()), distance: z.number() })
    ),
    pointsOfInterest: z
      .array(
        z.object({
          distance: z.number().nullish(), // 0.36550000309944153
          name: z.string().nullish(), // "Yeshiva University Museum"
          type: z.string().nullish(), // "MUSEUM" @note enum
        })
      )
      .nullish(),
  }),
  media: z.any().nullish(), // null,
  amenities: z.object({ list: z.array(Amenities) }),
  /** @deprecated unimportant */
  hasActiveBuildingShowcase: z.boolean().nullish(),
  /** @deprecated unimportant */
  hasPropertyDocs: z.boolean().nullish(),
  /** @deprecated unimportant */
  nearbySchools: z.array(z.any()).nullish(),
  aboutBuildingType: z.string().nullish(), // "Rental building",
  /** @deprecated unimportant */
  colleges: z.array(z.string()),
  documentsUrl: zUrl.nullish(), // "https://streeteasy.com/building/the-mayfair-145-4th-avenue-new_york/documents",
  latitude: z.number(), // 40.733856,
  longitude: z.number(), // -73.989555,
  /** @deprecated unimportant */
  museums: z.array(z.string()).nullish(),
  /** @deprecated unimportant */
  parks: z.array(z.string()).nullish(),
  /** @deprecated unimportant */
  schools: z.string().nullish(), // "$28",
  /** @deprecated unimportant */
  transitStations: z.string().nullish(), // "$29",
});
const ListingSchema = z.object({
  id: ListingIdField,
  buildingId: z.string(),
  daysOnMarket: z.number(), // 19,
  onMarketAt: zDayjs, // "2025-04-11",
  legacy: z.object({
    sourceGroupLabel: z.string(), // "Manhattan Realty Group",
    license: z.object({
      address: AddressDb,
      businessName: z.string(), // "Manhattan Realty Group",
      licenseType: z.string(), // "Corporate Broker",
    }),
  }),
  status: RentalHistoryStatus,
  statusChanges: z.array(z.object({ status: RentalHistoryStatus, changedAt: zDayjs })),
  createdAt: zDayjs, // "2025-04-11T15:45:44.000-04:00",
  updatedAt: zDayjs, // "2025-04-14T10:41:03.000-04:00",
  availableAt: zDayjs, // "2025-06-01",
  interestingChangeAt: zDayjs, // "2025-04-11T15:55:44.000-04:00",
  description: z.string().nullish(), // "$35",
  propertyDetails: z.object({
    address: AddressDb.omit({ latitude: true, longitude: true, region: true }),
    roomCount: z.number(), // 4,
    bedroomCount: z.number(), // 2,
    fullBathroomCount: z.number(), // 2,
    halfBathroomCount: z.number(), // 0,
    livingAreaSize: z.number(), // 990,
    lotAreaSize: z.number(), // 0,
    amenities: z.object({
      list: z.array(Amenities),
      doormanTypes: z.array(z.any()),
      parkingTypes: z.array(z.any()),
      sharedOutdoorSpaceTypes: z.array(z.any()),
      storageSpaceTypes: z.array(z.any()),
    }),
    features: z.object({
      list: z.array(Amenities),
      fireplaceTypes: z.array(z.any()),
      privateOutdoorSpaceTypes: z.array(z.any()),
      views: z.array(z.string()), // ["CITY", "SKYLINE"],
    }),
  }),

  propertyHistory: z.array(
    z.object({
      listingId: ListingIdField, // "4709208",
      sourceGroupLabel: z.string(), // "Manhattan Realty Group",
      rentalEventsOfInterest: z.array(
        z.object({
          date: zDayjs, // "2025-04-11",
          price: z.number(), // 8250
          status: RentalHistoryStatus,
        })
      ),
    })
  ),
  pricing: z.object({
    noFee: z.boolean(), // false,
    price: z.number(), // 8250,
    furnishedRent: z.any(), // null,
    dueUpFront: z.any(), // null,
    securityDeposit: z.any(), // null,
    leaseTermMonths: z.any(), // null,
    monthsFree: z.any(), // null,
    rentedPrice: z.any(), // null,
    netEffectiveRent: z.any(), // null,
    interestingPriceDelta: z.any(), // null,
    priceChanges: z.array(z.object({ price: z.number(), changedAt: zDayjs })), // [{price: 8250, changedAt: "2025-04-11T15:55:43.000-04:00"}]
  }),
  upcomingOpenHouses: z.array(z.any()),
  slug: z.string(), // "16a",
  offMarketAt: z.any(), // null,
  listingSource: z.object({ sourceType: z.string(), sourceListingId: z.any() }), // {sourceType: "PARTNER",sourceListingId: null,}
  mlsNumber: z.any(), // null,
  media: z.object({
    videos: z.array(z.any()),
    tour3dUrl: z.any(), // null,
    floorPlans: z.array(z.object({ key: z.string() })),
  }),
  recentListingsPriceStats: z.object({
    bedroomCount: z.number(), // 2,
    rentalPriceStats: z.object({
      maxPrice: z.number(), // 18900,
      medianPrice: z.number(), // 4995,
      minPrice: z.number(), // 1000,
      numListings: z.number(), // 389,
    }),
    salePriceStats: z.object({
      maxPrice: z.number(), // 3495000,
      medianPrice: z.number(), // 1679000,
      minPrice: z.number(), // 395000,
      numListings: z.number(), // 69,
    }),
  }),
  latestListing: z.object({
    id: ListingIdField, // "4709208",
    status: RentalHistoryStatus,
    pricing: z.object({ price: z.number() /*8250*/ }),
  }),
  urlPath: z.string(), // "/building/the-mayfair-145-4th-avenue-new_york/16a",
  saleType: z.any(), // null,
});
const ContactBoxInitialDataSchema = z.object({
  apiV6Endpoint: zUrl, // "http://apollo-router.apollo-router.svc.cluster.local:8080",
  clientContext: z.object({
    deviceId: z.string(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
    preferred_time_of_day: z.string(), // "9:00 AM",
    preferred_tour_date: z.string(), // "Thu, May 1",
  }),
  context: z.object({
    deviceId: z.string(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
    listingId: z.string(), // "4709208",
    listingType: z.string(), // "rental",
    sst: z.any().nullish(),
    isLoggedIn: z.boolean(),
    authToken: z.string(), // "$undefined",
    userAgent: z.string(), // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  }),
  ctaTemplate: z.string(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
  initialPageFlow: z.object({
    code: z.number(), // 200,
    pageflowId: z.string(), // "0d096dl3aarp7c06r54i0",
    pageflowType: z.string(), // "STATELESS",
    page: z.object({
      id: z.string(), // "rentals",
      config: z.object({
        contextualBlock: z.object({
          contact_box: z.object({
            contact_program_txt: z.string(), // "paid_inclusion",
            contact_box_type_cd: z.string(), // "",
            contact_program_segment_txt: z.any().nullish(),
          }),
        }),
      }),
      elements: z.array(
        z.object({
          type: z.string(), // "DISPLAY",
          componentType: z.string(), // "CTA",
          config: z.object({
            secondary: z.object({
              actionData: z.object({
                clickstreamEvent: z.object({
                  eventName: z.string(), // "event_5094_v5",
                  eventOptions: z.object({
                    triggerSource: z.string(), // "button_to_ask_a_question",
                    contextualBlocks: z.object({
                      contact_box: z.object({
                        contact_program_txt: z.string(), // "paid_inclusion",
                        contact_box_type_cd: z.string(), // "ask_a_question",
                        contact_program_segment_txt: z.any().nullish(),
                      }),
                    }),
                  }),
                }),
                name: z.string(), // "ContactBox-HDP-Rentals-Consumer-AskQuestion-v.0.0.2.workflow",
                context: z.object({
                  listedByList: z.array(
                    z.object({
                      contactId: z.number(), // 362385,
                      profileId: z.number(), // 955466,
                      name: z.string(), // "Luis Hernandez",
                      phone: z.string(), // "+16467156554",
                      licenseType: z.string(), // "Real Estate Salesperson",
                      sourceGroupLabel: z.string(), // "Manhattan Realty Group",
                      isPro: z.boolean(),
                      // "c9b923ae3f35bff2e5ddbcd6a2c4fc2c",
                      profileImage: z.object({ key: z.string() }),
                    })
                  ),
                  authToken: z.any().nullish(),
                  contact_box: z.object({
                    contact_program_txt: z.string(), // "paid_inclusion",
                    contact_box_type_cd: z.string(), // "ask_a_question",
                    contact_program_segment_txt: z.any().nullish(),
                  }),
                  isLoggedIn: z.boolean(),
                  chip_storing_tcpa_consents: z.boolean(),
                  listingId: z.string(), // "4709208",
                  listing: z.object({
                    id: z.string(), // "4709208",
                    propertyDetails: z.object({
                      // @note IMPORTANT
                      address: z.object({
                        unit: z.string(), // "16A",
                        city: z.string(), // "NEW YORK",
                        houseNumber: z.string(), // "145",
                        state: z.string(), // "NY",
                        street: z.string(), // "145 4th Avenue",
                        streetName: z.string(), // "4 AVENUE",
                        zipCode: z.string(), // "10003",
                      }),
                      bedroomCount: z.number(), //  2,
                      fullBathroomCount: z.number(), //  2,
                      halfBathroomCount: z.number(), //  0,
                    }),
                    pricing: z.object({ price: z.number() }),
                    status: z.string(), // "ACTIVE",
                    legacy: z.object({ sourceGroupLabel: z.string() }), // "Manhattan Realty Group",
                  }),
                  listingAddress: z.string(), // "145 4th Avenue #16A",
                  user: z.any().nullish(),
                  rentalId: z.string(), // "4709208",
                }),
                defaultTriggerLabel: z.string(), // "home_details_component|user_actions",
                fieldValues: z.object({
                  listedBy: z.object({
                    contactId: z.number(), // 362385,
                    profileId: z.number(), // 955466,
                    name: z.string(), // "Luis Hernandez",
                    phone: z.string(), // "+16467156554",
                    licenseType: z.string(), // "Real Estate Salesperson",
                    sourceGroupLabel: z.string(), // "Manhattan Realty Group",
                    isPro: z.boolean(),
                    profileImage: z.object({ key: z.string() }),
                  }),
                  name: z.any().nullish(),
                  phone: z.any().nullish(),
                  email: z.any().nullish(),
                }),
                event: z.object({ action: z.string() }),
                headline: z.string(), // "Ask a question",
              }),
              actionName: z.string(), // "emitClientEvent",
              label: z.string(), // "Ask a question",
            }),
            primary: z.object({
              actionData: z.object({
                clickstreamEvent: z.object({
                  eventName: z.string(), // "event_5094_v5",
                  eventOptions: z.object({
                    triggerSource: z.string(), // "button_to_request_a_tour",
                    contextualBlocks: z.object({
                      contact_box: z.object({
                        contact_program_txt: z.string(), // "paid_inclusion",
                        contact_box_type_cd: z.string(), // "schedule_tour",
                        contact_program_segment_txt: z.any().nullish(),
                      }),
                    }),
                  }),
                }),
                name: z.string(), // "ContactBox-HDP-Rentals-Consumer-RequestTour-v.0.0.2.workflow",
                context: z.object({
                  listedByList: z.array(
                    z.object({
                      contactId: ListingIdField, // 362385,
                      profileId: ListingIdField, // 955466,
                      name: z.string(), // "Luis Hernandez",
                      phone: z.string(), // "+16467156554",
                      licenseType: z.string(), // "Real Estate Salesperson",
                      sourceGroupLabel: z.string(), // "Manhattan Realty Group",
                      isPro: z.boolean(),
                      profileImage: z.object({
                        key: z.string(), // "c9b923ae3f35bff2e5ddbcd6a2c4fc2c",
                      }),
                    })
                  ),
                  authToken: z.any().nullish(),
                  contact_box: z.object({
                    contact_program_txt: z.string(), // "paid_inclusion",
                    contact_box_type_cd: z.string(), // "schedule_tour",
                    contact_program_segment_txt: z.any().nullish(),
                  }),
                  isLoggedIn: z.boolean(),
                  chip_storing_tcpa_consents: z.boolean(),
                  listingId: z.string(), // "4709208",
                  listing: z.object({
                    id: z.string(), // "4709208",
                    // @note IMPORTANT
                    propertyDetails: z.object({
                      address: z.object({
                        unit: z.string(), // "16A",
                        city: z.string(), // "NEW YORK",
                        houseNumber: z.string(), // "145",
                        state: z.string(), // "NY",
                        street: z.string(), // "145 4th Avenue",
                        streetName: z.string(), // "4 AVENUE",
                        zipCode: z.string(), // "10003",
                      }),
                      bedroomCount: z.number(), // 2,
                      fullBathroomCount: z.number(), // 2,
                      halfBathroomCount: z.number(), // 0,
                    }),
                    pricing: z.object({ price: z.number() }),
                    status: z.string(), // "ACTIVE",
                    legacy: z.object({ sourceGroupLabel: z.string() }), // "Manhattan Realty Group",
                  }),
                  listingAddress: z.string(), // "145 4th Avenue #16A",
                  user: z.any().nullish(),
                  rentalId: z.string(), // "4709208",
                }),
                defaultTriggerLabel: z.string(), // "home_details_component|user_actions",
                fieldValues: z.object({
                  listedBy: z.object({
                    contactId: z.number(), // 362385,
                    profileId: z.number(), // 955466,
                    name: z.string(), // "Luis Hernandez",
                    phone: z.string(), // "+16467156554",
                    licenseType: z.string(), // "Real Estate Salesperson",
                    sourceGroupLabel: z.string(), // "Manhattan Realty Group",
                    isPro: z.boolean(),
                    profileImage: z.object({ key: z.string() }),
                  }),
                  name: z.any().nullish(),
                  phone: z.any().nullish(),
                  email: z.any().nullish(),
                }),
                // {action: "click_to_request_tour"}
                event: z.object({ action: z.string() }),
                headline: z.string(), // "Request a tour",
              }),
              actionName: z.string(), // "emitClientEvent",
              label: z.string(), // "Request a tour",
            }),
          }),
          field: z.any().nullish(),
          children: z.array(z.any()),
        }),
        z.object({
          type: z.string(), // "DISPLAY",
          componentType: z.string(), // "HideIfSticky",
          config: z.object({}),
          field: z.any().nullish(),
          children: z.array(
            z.object({
              type: z.string(), // "DISPLAY",
              componentType: z.string(), // "HideIfMobile",
              config: z.object({}).passthrough(),
              field: z.any().nullish(),
              children: z.array(
                z.object({
                  type: z.string(), // "DISPLAY",
                  componentType: z.string(), // "ListingAgents",
                  config: z.object({
                    // "16px",
                    style: z.object({ marginTop: z.string() }),
                    contacts_federated: z.array(
                      z.object({
                        contactId: z.number(), // 362385,
                        profileId: z.number(), // 955466,
                        name: z.string(), // "Luis Hernandez",
                        phone: z.string(), // "+16467156554",
                        licenseType: z.string(), // "Real Estate Salesperson",
                        sourceGroupLabel: z.string(), // "Manhattan Realty Group",
                        isPro: z.boolean(),
                        profileImage: z.object({ key: z.string() }),
                      })
                    ),
                    title: z.string(), // "Listed By",
                    showPhoneNumberAction: z.object({
                      actionData: z.object({
                        event: z.object({ action: z.string(), label: z.string() }), // "click_to_show_number",  "reveal",
                        clickstreamEvent: z.object({ eventName: z.string() }).nullish(), // "event_5229_v2",
                      }),
                      actionName: z.string(), // "track",
                    }),
                    domain: zUrl,
                  }),
                  field: z.any().nullish(),
                  children: z.array(z.any()),
                })
              ),
            })
          ),
        })
      ),
    }),
    pageNum: z.number(), // 1,
    totalPages: z.number(), // 1,
    containerType: z.string(), // "EMBEDDED",
    config: z.object({
      appEventCategory: z.string(), // "Test",
      pageflow_id: z.string(), // "0d096dl3aarp7c06r54i0",
      page_id: z.string(), // "rentals",
      total_page_cnt: z.number(), // 1,
      displayType: z.string(), // "Test",
      eventCategory: z.string(), // "koios",
      style: z.object({}).passthrough(),
      track: z.object({ fields: z.boolean(), pages: z.boolean() }),
      flowName: z.string(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
      template_nm: z.string(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
      page_nb: z.number(), // 1,
      trackingId: z.string(), // "0d096dl3aarp7c06r54i0",
    }),
    replyToken: z.string(), // "159.4.1",
    experiments: z.array(
      z.object({
        assignment_service_cd: z.string(), // "split",
        key_type_cd: z.string(), // "guid",
        featureFlag: z.string(), // "streeteasy_rachel_rello_cta_2025",
        randomization_key: z.string(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
        treatment_nm: z.string(), // "control",
      })
    ),
    templateName: z.string(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
  }),
});
const ExperimentsSchema = z.object({
  streeteasy_sale_hdp_open_house_connect: z.object({
    assignment_service_cd: z.string().nullish(), //  "split",
    key_type_cd: z.string().nullish(), //  "guid",
    randomization_key: z.string().nullish(), //  "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
    treatment_nm: z.string().nullish(), //  "off",
  }),
});

/** Top-level JSON Schema */
export const HtmlPayloadSchema = z.object({
  building: BuildingSchema,
  headerData: HeaderDataSchema,
  listing: ListingSchema,
  contactBoxInitialData: ContactBoxInitialDataSchema,
  experiments: ExperimentsSchema,
  agentsIds: z.array(ListingIdField).nullish(), // ["362385"],
  enableLinkShareTracking: z.boolean().nullish(),
  note: z.string().nullish(), // ""
  referer: z.any(), // null
  agentsInfo: z.any(), // null
  //
});
