import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";
import { ZTypeEnum } from "./src/streeteasyValidation";
import { sendTestReq } from "./src/requestSchemas/streeteasyGql";

// const res = await axios.get("");
// cheerio.load(res.data);
const aaaa = ZTypeEnum.safeParse("");

sendTestReq();

console.log("Hello via Bunx!", aaaa);
