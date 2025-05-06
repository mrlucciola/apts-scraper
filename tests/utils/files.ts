import { env } from "bun";
import fs from "fs";

export const getTextFromFilepath = (filepath: string): string =>
  fs.readFileSync(filepath, { encoding: "utf8" });

export const getHtmlFilepathsFromDir = (absoluteDirpath: string): string[] => {
  const filepaths = fs.readdirSync(absoluteDirpath);
  return filepaths.filter((fp) => fp.endsWith(".html"));
};

/**
 *
 * @param dirpathFromRoot i.e. "/src/singleListing/sources"
 */
export const getHtmlFilesFromDir = (dirpathFromRoot: `/${string}`): string[] => {
  const absoluteDirpath = env.PWD + dirpathFromRoot;
  const filepaths = getHtmlFilepathsFromDir(absoluteDirpath);
  return filepaths.map((fp) => getTextFromFilepath(`${absoluteDirpath}/${fp}`));
};
