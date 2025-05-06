import { z } from "zod";
import { zUrl } from "../../../../../utils/zod";

const unimportantFields = z.object({
  account_tools: z
    .object({
      advertise_dropdown_links: z.array(z.any()).nullish(),
      advertise_total_count: z.number().nullish(),
      advertise_url: zUrl,
      new_connections_count: z.number().nullish(),
    })
    .nullish(),
  main_navigation: z
    .object({
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
    })
    .nullish(),
});
const importantFields = z.object({});
export const HeaderDataSchema = unimportantFields
  .extend({
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
export type HeaderDataSchema = z.infer<typeof HeaderDataSchema>;
