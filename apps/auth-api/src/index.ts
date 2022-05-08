import {$log} from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import {Server} from "./Server";

async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();

    process.on("SIGINT", () => {
      void platform.stop();
    });
  } catch (error) {
    $log.error({
      error,
      event: "SERVER_BOOTSTRAP_ERROR",
    });
  }
}

void bootstrap();
