import { ScriptInnerTextSchema } from "./domElemToPayload";

/** @todo Parse using JSDOM tools (i.e. `querySelector`) if possible */
export const extractScriptString = (doc: Document): string | null => {
  const docBody = doc?.querySelector("body");
  const scriptLines = docBody?.innerHTML
    .split("\n")
    .filter((line) => line.trim().includes("self.__next_f.push(["));

  if (!scriptLines || scriptLines.length === 0) throw new Error("No scripts found in document");

  for (let idx = 0; idx < scriptLines.length; idx++) {
    const line = scriptLines[idx];
    const elemInnerHtml = line.trim();
    const val = ScriptInnerTextSchema.safeParse(elemInnerHtml);
    if (val.data) return val.data;
  }

  return null;
};
