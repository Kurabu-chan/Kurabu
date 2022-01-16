import { execSync } from "child_process";
import packagejson from "../package.json";
import { readFileSync, writeFileSync } from "fs";

const workspaces = packagejson.workspaces.map(x => x.split("/")[0]);

if (process.env.BEFORE_SHA === undefined) {
    console.error("BEFORE_SHA environment variable is not set");
    process.exit(1);
}

if (process.env.AFTER_SHA === undefined) {
    console.error("AFTER_SHA environment variable is not set");
    process.exit(1);
}

var res = execSync(`git diff --name-only ${process.env.BEFORE_SHA} ${process.env.AFTER_SHA}`);
var resString = res.toString('utf-8');

const workspaceFileChanges: string[] = []

for (const file of resString.split("\n")) {
    if (workspaces.includes(file.split("/")[0])) {
        workspaceFileChanges.push(file);
    }
}
const workspacesThatChanged = [...new Set(workspaceFileChanges.map(x => x.split("/")[0] + "/" + x.split("/")[1]))]
const workspacePackageJsons = workspacesThatChanged.map(x => `${x}/package.json`)

for (const packjson of workspacePackageJsons) {
    let fileContent = readFileSync(packjson).toString('utf-8');
    const json = JSON.parse(fileContent);
    const version = json.version;
    const packname = json.name;
    const versionSplit = version.split(".");
    const newVersion = `${versionSplit[0]}.${versionSplit[1]}.${Number(versionSplit[2]) + 1}`;
    console.log(`Updating version for ${packname} from ${version} to ${newVersion}`);
    fileContent = fileContent.replace(/"version":\s*"[0-9]*\.[0-9]*\.[0-9]",/, `"version": "${newVersion}",`);
    writeFileSync(packjson, fileContent);
}

if (workspacePackageJsons.length === 0) {
    throw new Error("No bumps were done because there were no changes");
}