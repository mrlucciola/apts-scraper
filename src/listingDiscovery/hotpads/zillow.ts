/** (Pre-request) Check/Find existing listing-document
 * - Lookup using 'Zillow ID', 'Address'
 * - If none, return `null`
 */

/** # Use lookup info from Hotpads listing to send request to Zillow
 *
 * ### Candidate info:
 * - Zillow ID
 * - Full Address
 *
 * ## Questions
 * 1. Does this exist in the multi-listing-response
 * 1. Does this exist in the single-listing-response
 *
 * ## Todos
 * 1. (Pre-request) Pipe in info from DB model (Get `listing-object-fields`)
 * 1. (Pre-request) Build URL variable properties from `listing-object` fields
 * 1. (Pre-request) Build URL query parameters from `listing-object` fields
 * 1. Build request (URL, body/data/params, cookies, headers)
 * 1. (Post-request) Extract relevant info from HTML/JSON
 * 1. (Post-request) Build DB model from extracted response and `return`
 */

/** (Post-request) Insert request data into `hotpads`-specific section of listing-document */

/** (Post-request) Update 'aggregate' section of listing-document
 * @note This logic should be general to ALL sites - NOT
 */
