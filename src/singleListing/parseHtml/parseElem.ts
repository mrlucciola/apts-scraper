// class: popularity popularity-redesign
// text: "This rental has been saved by 131 users."

import { zNumeric } from "../../utils/zod";

// text: "has been saved by" + target + "users"
export const parseSavedUserCt = (doc: Document): number => {
  const elem = doc.querySelector("div.annotation > div.popularity");
  const content = elem?.textContent;

  const savedByRegex = /.*(?:saved by).(\d+).+/gm;
  const resultArr = content ? savedByRegex.exec(content) : null;
  const result = resultArr && resultArr?.length > 1 ? resultArr[1] : null;
  const validatedResult = zNumeric.safeParse(result);
  if (!validatedResult.data) {
    console.error("REGEX RESULT", result);
    console.error("ERROR", validatedResult.error);
    throw new Error("Error parsing saved-user-ct");
  }

  return validatedResult.data;
};
