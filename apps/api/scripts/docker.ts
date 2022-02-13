import { execAsync, execReturnOutputAsync } from "./libs/execute";
import packageJson from "../package.json";
const version = packageJson.version;

/*
docker.ts --help


*/

const contexts = ["development", "latest", "production"] as const;
type Context = typeof contexts[number];

// docker buildx build --load -t kurabu/api -f ../docker/Dockerfile ../../../
// docker buildx build --push -t rafaeltab/kurabu.api:latest -t rafaeltab/kurabu.api:<version> -f ../docker/Dockerfile ../../../
// docker buildx build --push -t rafaeltab/kurabu.api:prod -t rafaeltab/kurabu.api:<version> -t rafaeltab/kurabu.api:latest -f ../docker/Dockerfile ../../../
(async () => {
    var args = process.argv;

    const contextIndex = args.indexOf("--context");
    if (contextIndex === -1) {
        console.error("--context is required");
        process.exit(1);
        return;
    }

    if (!contexts.includes(args[contextIndex + 1] as Context)) {
        console.error("context has to be one of: " + contexts.join(", "));
        process.exit(1);
    }

    const context = args[contextIndex + 1] as Context;

    // create buildx builder

    const builder = await createBuilder();

    // use builder
    await execAsync("docker", ["buildx", "use", builder.name]);

    console.log("\nBuilding image\n\n");

    const dockerArgs = ["-f", "./docker/Dockerfile", "../../"];

    if (context === "development") {
        dockerArgs.unshift("-t", "kurabu/api");
        dockerArgs.unshift("--load");
        
        process.exit(await startBuild(dockerArgs));
    } else {
        // tag with latest and package json version
        dockerArgs.unshift("-t", "rafaeltab/kurabu.api:latest", "-t", `rafaeltab/kurabu.api:${version}`);
        // build for all available platforms
        dockerArgs.unshift("--platform=linux/amd64,linux/arm64/v8")

        if (context === "production") {
            dockerArgs.unshift("-t", "rafaeltab/kurabu.api:production");
        }

        dockerArgs.unshift("--push");

        process.exit(await startBuild(dockerArgs));
    }
})();

function startBuild(args: string[]) : Promise<number> {
    args.unshift("buildx", "build");
    console.log(`Running command: docker ${args.join(" ")}`);
    return execAsync("docker", args);
}

type Builder = {
    name: string,
    platforms: string[],
}

async function createBuilder(): Promise<Builder> {
    const name = "kurabu-api-builder";

    // check if builder exists
    console.log("\nGetting current builders\n\n");
    const listOut = await execReturnOutputAsync("docker", ["buildx", "ls"]);

    if (listOut.includes(name)) {
        // remove builder
        console.log("\nBuilder already exists, deleting\n\n");
        await execAsync("docker", ["buildx", "rm", name]);
    }

    console.log("\nCreating new builder\n\n");
    await execAsync("docker", ["buildx", "create", "--driver", "docker-container" ,"--name", name, "--driver-opt", "env.BUILDKIT_STEP_LOG_MAX_SIZE=-1", "--driver-opt", "env.BUILDKIT_STEP_LOG_MAX_SPEED=-1"]);

    // get platforms from builder
    console.log("\nGetting platforms from builder\n\n");
    const inspectOut = await execReturnOutputAsync("docker", ["buildx", "inspect", name]);
    const platforms = inspectOut.split("Platforms: ")[1].split(", ");

    return {
        name,
        platforms
    }
}