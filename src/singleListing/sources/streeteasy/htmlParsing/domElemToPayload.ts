import { z } from "zod";
import { HtmlPayloadSchema_SeSl } from "./htmlToJsonValidation";

/** Validate text from within script tag
 * - After validation, transform to array-parameter contained within the `.push()` call (i.e. `[1, "a:[\"$ ... ]`)
 *
 * ### Before:
 * ```
 * <script>
 *   "self.__next_f.push([1, "a:[ ... ])"
 * </script>
 * ```
 *
 * ### Input:
 * `"self.__next_f.push([1, "a:[ ... ])"`
 *
 * ### After transform:
 * `[1, "a:[ ... ]"]`
 */
export const ScriptInnerTextSchema = z
  .string()
  .trim()
  .startsWith("self.__next_f.push([")
  .endsWith("])")
  .transform((arg, _ctx) => {
    // Remove beginning parenthesis
    const trimBeginning = arg.replace("self.__next_f.push([", "[");

    // Remove end parenthesis
    const trimmedStr = trimBeginning.slice(0, trimBeginning.length - 1);

    return trimmedStr;
  });

/**
 * ### Input:
 * `"[1, "a:["$", "$L18", null, { TARGET }]"]"`
 *
 * ### After transform:
 * `[1, "a:["$", "$L18", null, { TARGET }]"]`
 */
export const ScriptInnerTextSchema1_InitTuple = z.preprocess((input, _ctx) => {
  try {
    return JSON.parse(input as string);
  } catch (error) {
    return input;
  }
}, z.tuple([z.any(), z.string()]));
type ScriptInnerTextSchema1_InitTuple = z.infer<typeof ScriptInnerTextSchema1_InitTuple>;

/**
 * ### Input:
 * `[1, "a:["$", "$L18", null, { TARGET }]"]`
 *
 * ### After transform:
 * `{ a: ["$", "$L18", null, { TARGET }] }`
 */
export const ScriptInnerTextSchema2_ParentTuple = z.preprocess((_input, _ctx) => {
  const input = _input as ScriptInnerTextSchema1_InitTuple;
  const preparsed = input[1].trim();

  const openArrBracketIdx = preparsed.indexOf("[");
  const closeArrBracketIdx = preparsed.lastIndexOf("]");

  const arrStr = preparsed.slice(openArrBracketIdx, closeArrBracketIdx + 1);

  try {
    return JSON.parse(arrStr);
  } catch (error) {
    return input;
  }
}, z.tuple([z.any(), z.any(), z.any(), z.object({}).passthrough()]));
type ScriptInnerTextSchema2_ParentTuple = z.infer<typeof ScriptInnerTextSchema2_ParentTuple>;

/**
 * ### Input:
 * `["$", "$L18", null, { TARGET }]`
 *
 * ### After transform:
 * `{ TARGET }`
 */
export const ScriptInnerTextSchema3_Json = z.preprocess((input, ctx) => {
  return (input as ScriptInnerTextSchema2_ParentTuple)[3];
}, HtmlPayloadSchema_SeSl);
