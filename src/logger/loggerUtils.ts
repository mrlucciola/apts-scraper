import logger from "pino";

import dayjs from "dayjs";
import config from "../dbUtils/config";

const level = config.logLevel;

const log = logger({
  transport: { target: "pino-pretty" },
  level,
  base: { pid: false },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
