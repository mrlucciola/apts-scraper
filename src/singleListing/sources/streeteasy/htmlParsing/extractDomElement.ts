import {
  ScriptInnerTextSchema,
  ScriptInnerTextSchema2_Tuple,
  ScriptInnerTextSchema3_Json,
} from "./domElemToPayload";
import type { HtmlPayloadSchema } from "./htmlToJsonValidation";

/** @todo Parse using JSDOM tools (i.e. `querySelector`) if possible */
export const extractTargetJsonPayload = (doc: Document): HtmlPayloadSchema => {
  const docBody = doc?.querySelector("body");
  const docInnerHtml = docBody?.innerHTML;

  const scriptLines = docInnerHtml
    // ?.split(/\n\s+|\s+\n/)
    ?.split(/\<\/?(script|style)\>/)
    .filter((line) => line.includes("self.__next_f.push(["))
    .map((line) => line.replace("</script>", "").trim());

  if (!scriptLines || scriptLines.length === 0) throw new Error("No scripts found in document");

  for (let idx = 0; idx < scriptLines.length; idx++) {
    const elemInnerHtml = scriptLines[idx];

    // @todo @DELETE @deprecated
    if (!elemInnerHtml.includes(`self.__next_f.push([1, "a:["$"`)) continue;
    // console.log("elemInnerHtml", elemInnerHtml);
    const scriptInnerTextParsed = ScriptInnerTextSchema.safeParse(elemInnerHtml);
    if (!scriptInnerTextParsed.data) continue;

    const scriptInnerText2_tuple = ScriptInnerTextSchema2_Tuple.safeParse(
      scriptInnerTextParsed.data
    );

    if (!scriptInnerText2_tuple.data) continue;

    return ScriptInnerTextSchema3_Json.parse(scriptInnerText2_tuple.data);
  }

  throw new Error("No valid JSON found in any script innerText");
};
