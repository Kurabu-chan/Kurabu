import { execSync } from "child_process";
import packagejson from "../package.json";
import { readFileSync, writeFileSync } from "fs";

const workspaces = packagejson.workspaces.packages.map(x => x.split("/")[0]);

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

console.log(workspacePackageJsons.join(", "));