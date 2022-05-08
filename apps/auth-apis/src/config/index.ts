import pkg from "../../package.json";
import {envs} from "./envs";
import loggerConfig from "./logger";

export const config: Partial<TsED.Configuration> = {
  envs,
  logger: loggerConfig,
  version: pkg.version,
  // additional shared configuration
};
