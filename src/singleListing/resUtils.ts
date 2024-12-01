import { JSDOM } from "jsdom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { StreeteasyHtmlDetailSchema } from "./dbUtils/models";
import { parsePriceHistory } from "./parseHtml/priceHistory";
import { parseSavedUserCt } from "./parseHtml/parseElem";
import {
  parseActiveRentalStats,
  parseFullAddress,
  parseGqlItemPage,
} from "./parseHtml/activeRentalStats";

dayjs.extend(utc);
dayjs.extend(timezone);

export const newFilepath = (res: Response, type: "UNAUTH" | "REDIRECT" | "SUCCESS"): string =>
  `src/singleListing/local.html.test/${type}/${res.status}-${dayjs()
    .local()
    .format("YYYY-MM-DD-HH:mm:ss")}.html`;

export class Cookie {
  constructor(public getSetCookie: string[]) {}
  static fromRes(res: Response | Headers): Cookie {
    const headers: Headers = res instanceof Response ? res.headers : res;
    return new Cookie(headers.getSetCookie());
  }

  get params(): CookieParam[] {
    return this.getSetCookie.map((c) => CookieParam.fromStr(c));
  }
  get asMap(): Map<string, string> {
    return new Map<string, string>(
      this.getSetCookie.map((c) => {
        const param = CookieParam.fromStr(c);
        return [param.key, param.value];
      })
    );
  }
}
export class CookieParam {
  value: string;
  constructor(public key: string, value?: string | null) {
    this.value = value ?? "";
  }
  /**
   * Convert: "_actor=eyJpZCI6ImMvNUpOdGdMNzk2QUVCb1hmS1dSUFE9PSJ9--c9a53d39f5bde69e0830f74459243cabb9da7037; path=/; expires=Sun, 27 Nov 2044 20:16:17 GMT; secure"
   * To: { _actor: "eyJpZCI6ImMvNUpOdGdMNzk2QUVCb1hmS1dSUFE9PSJ9--c9a53d39f5bde69e0830f74459243cabb9da7037" }
   */
  static fromStr(cookieParamStr: string): CookieParam {
    const kv = cookieParamStr.split("="); // "_se_t=68aa3d4e-8399-47af-962a-ad7939595256; path=/; expires=Sat, 29 Nov 2025 17:17:41 GMT; secure"
    const key = kv[0];
    const value = kv.length > 1 ? kv[1].split(";")[0] : null;
    return new CookieParam(key, value);
  }
  get asStr(): string {
    return `${this.key}=${this.value}`;
  }
  get asArr(): [string, string] {
    return [this.key, this.value];
  }
}

export const parseResCookies = (res: Response) => {
  if (res.headers.getSetCookie().length === 0) throw new Error("No response cookies");
  const cookies = res.headers.getSetCookie().map((c) => CookieParam.fromStr(c));
  return cookies;
};

// Convert HTML-response to document
export const fetchResToDoc = async (resOrFilepath: Response): Promise<Document> => {
  // fs.readFileSync("./src/singleListing/local.html.test/SUCCESS/200-2024-11-29-14:53:09.html", {
  //   encoding: "utf8",
  //   flag: "r",
  // })

  const htmlStr = await resOrFilepath.text();

  const parsedHtmlDom: JSDOM = new JSDOM(htmlStr);
  return parsedHtmlDom.window.document;
};

export const docToDbModel = (doc: Document): StreeteasyHtmlDetailSchema =>
  StreeteasyHtmlDetailSchema.parse({
    priceHistory: parsePriceHistory(doc),
    savedByCt: parseSavedUserCt(doc),
    activeRentalStats: parseActiveRentalStats(doc),
    description: parseGqlItemPage(doc).about.description,
    name: parseGqlItemPage(doc).about.name,
    fullAddress: parseFullAddress(doc),
  });
