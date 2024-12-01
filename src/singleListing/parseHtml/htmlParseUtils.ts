import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Attr: `data-testid="priceHistoryTable"`
 * Elem: `<div class="PropertyHistoryTables_tabContent__UWZNv" data-testid="priceHistoryTable">`
 *
 * @param htmlDoc `(new JSDOM(htmlRes)).parsedHtmlDom.window.document`
 * @param htmlAttr `data-testid` i.e. `[data-testid="priceHistoryTable"]`
 * @param attrValue `priceHistoryTable` i.e. `[data-testid="priceHistoryTable"]`
 */
export const parseHtmlByAttr = (
  htmlDoc: Document,
  htmlAttr: string,
  attrValue: string,
  shouldThrow: boolean = false
) => {
  const attrSelector = `[${htmlAttr}="${attrValue}"]`;
  const elem = htmlDoc.querySelector(attrSelector);
  if (!elem) {
    console.warn("htmlDoc", htmlDoc.textContent);
    if (shouldThrow)
      throw new Error(`parseHtmlByAttr(): no element found for attr: ${attrSelector}`);
  }
  return elem;
};
