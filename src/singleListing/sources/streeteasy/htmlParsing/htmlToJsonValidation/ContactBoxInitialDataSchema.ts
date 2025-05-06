import { z } from "zod";
import { zUrl } from "../../../../../utils/zod";
import { ListingIdField } from "../../../../../general/commonValidation";
import { ActionDataSchema, ListedByListItem } from "../general";

const InitialPageFlowSchema = z.object({
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
        componentType: z.string().nullish(), // "CTA" | "HideIfSticky",
        config: z
          .object({
            secondary: z
              .object({
                actionData: ActionDataSchema,
                actionName: z.string().nullish(), // "emitClientEvent",
                label: z.string().nullish(), // "Ask a question",
              })
              .nullish(),
            primary: z
              .object({
                actionData: ActionDataSchema,
                actionName: z.string().nullish(), // "emitClientEvent",
                label: z.string().nullish(), // "Request a tour",
              })
              .nullish(),
          })
          .passthrough(),
        field: z.any().nullish(), // null
        children: z.array(
          z.object({
            type: z.string(), // "DISPLAY",
            componentType: z.string().nullish(), // "HideIfMobile",
            config: z.object({}).passthrough().nullish(),
            field: z.any().nullish(),
            children: z.array(
              z.object({
                type: z.string(), // "DISPLAY",
                componentType: z.string(), // "ListingAgents",
                config: z.object({
                  style: z.object({ marginTop: z.string().nullish() }).passthrough(), // "16px",
                  contacts_federated: z.array(ListedByListItem),
                  title: z.string(), // "Listed By",
                  showPhoneNumberAction: z
                    .object({
                      actionData: ActionDataSchema.pick({ event: true, clickstreamEvent: true }),
                      actionName: z.string().nullish(), // "track",
                    })
                    .passthrough()
                    .nullish(),
                  domain: zUrl.nullish(),
                }),
                field: z.any().nullish(),
                children: z.array(z.any()).nullish(),
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
    appEventCategory: z.string().nullish(), // "Test",
    pageflow_id: z.string().nullish(), // "0d096dl3aarp7c06r54i0",
    page_id: z.string(), // "rentals",
    total_page_cnt: z.number(), // 1,
    displayType: z.string().nullish(), // "Test",
    eventCategory: z.string().nullish(), // "koios",
    style: z.object({}).passthrough(),
    track: z.object({ fields: z.boolean(), pages: z.boolean() }),
    flowName: z.string().nullish(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
    template_nm: z.string().nullish(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
    page_nb: z.number().nullish(), // 1,
    trackingId: z.string().nullish(), // "0d096dl3aarp7c06r54i0",
  }),
  replyToken: z.string().nullish(), // "159.4.1",
  experiments: z
    .array(
      z.object({
        assignment_service_cd: z.string().nullish(), // "split",
        key_type_cd: z.string().nullish(), // "guid",
        featureFlag: z.string().nullish(), // "streeteasy_rachel_rello_cta_2025",
        randomization_key: z.string().nullish(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
        treatment_nm: z.string().nullish(), // "control",
      })
    )
    .nullish(),
  templateName: z.string().nullish(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
});

export const ContactBoxInitialDataSchema = z.object({
  apiV6Endpoint: zUrl, // "http://apollo-router.apollo-router.svc.cluster.local:8080",
  clientContext: z
    .object({
      deviceId: z.string().nullish(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
      preferred_time_of_day: z.string().nullish(), // "9:00 AM",
      preferred_tour_date: z.string().nullish(), // "Thu, May 1",
    })
    .nullish(),
  context: z.object({
    deviceId: z.string(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
    listingId: ListingIdField, // "4709208",
    listingType: z.string(), // "rental",
    sst: z.any().nullish(),
    isLoggedIn: z.boolean(),
    authToken: z.string().nullish(), // "$undefined",
    userAgent: z.string().nullish(), // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  }),
  ctaTemplate: z.string().nullish(), // "ContactBox-Rentals-Consumer-CTA-v0.0.2.workflow",
  initialPageFlow: InitialPageFlowSchema,
});
