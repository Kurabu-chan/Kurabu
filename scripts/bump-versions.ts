import { execSync } from "child_process";
import packagejson from "../package.json";
import { readFileSync, writeFileSync } from "fs";

if (process.env.CHANGED_JSONS === undefined) {
    throw new Error("CHANGED_JSONS environment variable is not set");
}

const workspacePackageJsons = process.env.CHANGED_JSONS.split(", ")

for (const packjson of workspacePackageJsons) {
    let fileContent = readFileSync(packjson).toString('utf-8');
    const json = JSON.parse(fileContent);
    const version = json.version;
    const packname = json.name;
    const versionSplit = version.split(".");
    const newVersion = `${versionSplit[0]}.${versionSplit[1]}.${Number(versionSplit[2]) + 1}`;
    console.log(`Updating version for ${packname} from ${version} to ${newVersion}`);
    fileContent = fileContent.replace(/"version":\s*"[0-9]*\.[0-9]*\.[0-9]*",/, `"version": "${newVersion}",`);
    writeFileSync(packjson, fileContent);
}

if (workspacePackageJsons.length === 0) {
    throw new Error("No bumps were done because there were no changes");
}