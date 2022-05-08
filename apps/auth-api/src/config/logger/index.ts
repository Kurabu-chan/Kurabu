import {$log, PlatformLoggerSettings} from "@tsed/common";
import {isProduction} from "../envs";

if (isProduction) {
  $log.appenders.set("stdout", {
    layout: {
      type: "json"
    },
    levels: ["info", "debug"],
    type: "stdout",
  });

  $log.appenders.set("stderr", {
    layout: {
      type: "json"
    },
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
  });
}

export default {
  disableRoutesSummary: isProduction
} as PlatformLoggerSettings;
