import fs from "fs";
import { PastListingsExperience, type PriceHistory } from "./altHtmlSchemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const parsePriceHistoryTableHydrate = (htmlDoc: Document): PriceHistory[] => {
  const pastListingsExperienceElem = htmlDoc
    .querySelector(`[data-se-entry-hydrate="pastListingsExperience"]`)
    ?.parentElement?.querySelector("script");
  const split = pastListingsExperienceElem?.innerHTML.split("=", 2).slice(1)[0];
  if (!split) throw new Error("`pastListingsExperienceElem` does not exist");
  const [_, pastListingExpInit] = JSON.parse(split) as [
    "PastListingsExperience",
    PastListingsExperience
  ];
  const pastListingExp = PastListingsExperience.parse(pastListingExpInit);
  const priceHistoryArr = pastListingExp.pastListingsData.rental.price_histories;

  return priceHistoryArr;
};

/** @deprecated */
const parsePriceHistoryTableTestId = (htmlDoc: Document) => {
  // const priceHistoryTableElem = parseHtmlByAttr(htmlDoc, "data-testid", "priceHistoryTable");

  fs.writeFileSync(
    `src/singleListing/local.html.test/priceHistory/pricehistorytable-${dayjs()
      .local()
      .format("YYYY-MM-DD-HH:mm:ss")}.html`,
    htmlDoc.documentElement.innerHTML
  );

  throw new Error("Not yet supported: Parse price history by `test-id` attr");
};

export const parsePriceHistory = (htmlDoc: Document): PriceHistory[] =>
  parsePriceHistoryTableHydrate(htmlDoc) ?? parsePriceHistoryTableTestId(htmlDoc);
