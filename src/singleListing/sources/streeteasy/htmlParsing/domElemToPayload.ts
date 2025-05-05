import { z } from "zod";
import { HtmlPayloadSchema } from "./htmlToJsonValidation";

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
 * `["$", "$L18", null, { TARGET }]`
 */
export const ScriptInnerTextSchema2_Tuple = z.preprocess((_input, _ctx) => {
  const input = _input as string;
  const preparsed = input;
  const openArrBracketIdx = input.indexOf('"', input.indexOf('"') + 1);
  const closeArrBracketIdx = input.lastIndexOf('"');
  const arrSlice = preparsed.slice(openArrBracketIdx - 1, closeArrBracketIdx);

  try {
    return JSON.parse(arrSlice);
  } catch (error) {
    return input;
  }
}, z.tuple([z.any(), z.any(), z.any(), z.object({}).passthrough()]));
type ScriptInnerTextSchema2_Tuple = z.infer<typeof ScriptInnerTextSchema2_Tuple>;

/**
 * ### Input:
 * `["$", "$L18", null, { TARGET }]`
 *
 * ### After transform:
 * `{ TARGET }`
 */
export const ScriptInnerTextSchema3_Json = z.preprocess((input, ctx) => {
  return (input as ScriptInnerTextSchema2_Tuple)[3];
}, HtmlPayloadSchema);
