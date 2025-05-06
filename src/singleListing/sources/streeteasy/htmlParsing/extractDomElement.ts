import { JSDOM } from "jsdom";
import {
  ScriptInnerTextSchema,
  ScriptInnerTextSchema1_InitTuple,
  ScriptInnerTextSchema2_ParentTuple,
  ScriptInnerTextSchema3_Json,
} from "./domElemToPayload";
import type { HtmlPayloadSchema_SeSl } from "./htmlToJsonValidation";

export const extractTargetJsonPayloadJsdom = (htmlStr: string): HtmlPayloadSchema_SeSl => {
  // Remove the self-closing <iframe /> element
  const cleanedHtml = htmlStr.replace(/<iframe[^>]*\/>/gi, "");

  const parsedHtmlDom = new JSDOM(cleanedHtml);
  const bodyScripts = parsedHtmlDom.window.document.body.querySelectorAll("script");

  for (let idx = 0; idx < bodyScripts.length; idx++) {
    const scriptText = bodyScripts[idx].textContent;

    const scriptInnerTextParsed = ScriptInnerTextSchema.safeParse(scriptText);
    if (!scriptInnerTextParsed.data) continue;

    const initTuple = ScriptInnerTextSchema1_InitTuple.safeParse(scriptInnerTextParsed.data);
    if (!initTuple.data) continue;

    if (!initTuple.data[1].startsWith("a:[")) continue;

    const payloadParentTuple = ScriptInnerTextSchema2_ParentTuple.safeParse(initTuple.data);
    if (!payloadParentTuple.data) continue;

    return ScriptInnerTextSchema3_Json.parse(payloadParentTuple.data);
  }

  throw new Error("No valid JSON found in any script innerText");
};
