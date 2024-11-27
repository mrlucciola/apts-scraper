import fs from "fs";
import { z } from "zod";
import { JSDOM } from "jsdom";

const zUrl = z.string().url(); //.startsWith("https://streeteasy.com");
type zUrl = z.infer<typeof zUrl>;

/**
 * - Specific to getting session/anon-user headers for API requests
 * - Doesn't work with axios (must use JS-Fetch-API)
 */
const fetchHtml = async (listingUrl: zUrl) => {
  const res = await fetch(listingUrl, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.8",
      "cache-control": "max-age=0",
      "if-none-match": 'W/"0412c709686f6f828cddc98909392410"',
      "sec-ch-ua": '"Not A(Brand";v="99", "Brave";v="121", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
  });
  const isUnauth = res.status === 403;
  if (isUnauth) {
    // generateCookiesReq()
  }
};

const generateCookiesReq = async (listingUrl: zUrl) => {
  const res = await fetch(listingUrl, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.8",
      priority: "u=0, i",
      "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
  });
  const isRedirect = res.status === 301;
  console.log("res.status", res.status);
  if (isRedirect) {
    console.log("redirect heaers:", res.headers);
  }

  const isUnauth = res.status === 403;
  if (isUnauth) {
    // NEED TO call endpoint again with updated headers/cookies (https://streeteasy.com/rental/3943463)
    // 1. get res headers/cookies
    // 1.a Call req to get 301
    // req cookies:
    // - _px3=89c8ca91566d9abfad1ee6233d234ed5e344444c5f5d1781a524e8043b9c6e98:m7d1Goy12FSJdYSbNj6SurvbGm3ZBczyOENVLaQe2GZ/4aGoXMDUZsOCUw1ET6Y8OpuV7BQMrTuc3Y9rzHO94g==:1000:52ZTZYLCjoxvKqCFUPGUledWSpINGylgz5r2u/n2SQxcQRJpkrdXJpIvR7JpSY06JGpI7Ls1UAc6c5CNjimG7JLLdc3b5KNIfq8IrZfbi0y/eeL6cQu+tpjaj0Rvj3UKeQIEXWmgLG6ZAlLqQxpTSbzJPldtCeb3PWXil3RZLAcfuiBGSNGGfFt6eo2kOesT0x7z8ZganK5VvAxZEN4rvts2FrDeKdMs3HAnce1OGQo=
    // - _pxvid=
    // - pxcts=
    // 1.b RES RETURNS COOKIES:
    // - _actor
    // - _se_t
    // - _ses
    // - hdp3
    // - se_lsa

    //

    // Get the init req-res params
    // _actor
    // _px3;
    // _pxvid;
    // _se_t;
    // _ses;
    // hdp3;
    // pxcts;
    // se_lsa;
  }
  console.log("response full:", res);
  process.exit(0);
  return res;
};

/**
 * Convert: "_actor=eyJpZCI6ImMvNUpOdGdMNzk2QUVCb1hmS1dSUFE9PSJ9--c9a53d39f5bde69e0830f74459243cabb9da7037; path=/; expires=Sun, 27 Nov 2044 20:16:17 GMT; secure"
 * To: { _actor: "eyJpZCI6ImMvNUpOdGdMNzk2QUVCb1hmS1dSUFE9PSJ9--c9a53d39f5bde69e0830f74459243cabb9da7037" }
 */
const parseResCookie = (cookie: string) => {
  const kv = cookie.split("; ")[0];
  const key = kv.split("=")[0];
  const value = kv.split("=")[1];
  return {
    asArray: [key, value] as [string, string],
    asObj: { [key]: value },
    asStr: `${key}=${value}` as `${string}=${string}`,
  };
};
const parseResCookies = (res: Response) => {
  if (res.headers.getSetCookie().length) throw new Error("No response cookies");
  const cookies = res.headers.getSetCookie().map((c) => parseResCookie(c));
  return cookies;
};

const res = await generateCookiesReq("https://streeteasy.com/rental/3943463");
const parsedCookies = parseResCookies(res);

// const resJson = await res.json();
// console.log("res", res);
// console.log("res COOKIES PARSED", parsedCookies);

// Convert HTML-response to document
const fetchResToDoc = async (res: Response) => {
  const htmlRes = await res.text();
  console.log("res", res.headers);
  console.log("htmlRes", htmlRes);
  const parsedHtmlDom: JSDOM = new JSDOM(htmlRes);
  return parsedHtmlDom.window.document;
};
const parsedHtmlDoc = await fetchResToDoc(res);

// @delete - testing
// fs.writeFileSync("page.html", htmlRes);

/**
 */
/**
 * Attr: `data-testid="priceHistoryTable"`
 * Elem: `<div class="PropertyHistoryTables_tabContent__UWZNv" data-testid="priceHistoryTable">`
 *
 * @param htmlDoc `(new JSDOM(htmlRes)).parsedHtmlDom.window.document`
 * @param htmlAttr `data-testid` i.e. `[data-testid="priceHistoryTable"]`
 * @param attrValue `priceHistoryTable` i.e. `[data-testid="priceHistoryTable"]`
 */
const parseHtmlByAttr = (htmlDoc: Document, htmlAttr: string, attrValue: string) => {
  const attrSelector = `[${htmlAttr}="${attrValue}"]`;
  const priceHistoryTableElem = htmlDoc.querySelector(attrSelector);
  if (!priceHistoryTableElem) {
    console.log("htmlDoc", htmlDoc.textContent);
    throw new Error(`parseHtmlByAttr(): no element found for attr: ${attrSelector}`);
  }
  console.log("priceHistoryTableElem", priceHistoryTableElem);
};
parseHtmlByAttr(parsedHtmlDoc, "data-testid", "priceHistoryTable");
