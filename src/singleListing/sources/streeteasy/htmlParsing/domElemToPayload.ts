import { z } from "zod";

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
    const trimBeginning = arg.trim().replace("self.__next_f.push([", "[");

    // Remove end parenthesis
    const trimmedStr = trimBeginning.slice(0, trimBeginning.length - 1);

    return trimmedStr;
  });

/**
 * ### Input:
 * `[1, "a:[ ... ]"]`
 *
 * ### After transform:
 * `{ a: [ ... ] }`
 */
export const InitTwoElemArraySchema = z
  .tuple([z.number(), z.string()])
  .transform((arg, _ctx) => JSON.parse("{" + arg[1] + "}"));
