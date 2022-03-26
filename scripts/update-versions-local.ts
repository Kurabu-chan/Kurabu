import packJson from "../package.json";
import { join } from "path";
import { match } from "minimatch";
import { parse, SemVer } from "semver";
import { copyFileSync, existsSync, fstat, readFileSync, writeFileSync } from "fs";
import { exec } from "shelljs";
import { exit } from "process";

// get commit changed files
// git diff-tree --no-commit-id --name-only -r HEAD

(async () => {
    console.log("Updating versions...");
    const changedWorkspaces = await findChangedWorkspaces();

    if(changedWorkspaces.length === 0) {
        console.log("No changed workspaces");
        exit(0);
    }

    const changedWorkspaceVersions: string[] = []

    for (const workspace of changedWorkspaces) {
        console.log(`Updating ${workspace}`);
        const path = join(workspace, "package.json").replace(/\\/g, "/");

        const versionUpdated = didVersionUpdate(path);

        if (versionUpdated) { 
            console.log(`${workspace} has a version update, not updating again`);
            continue;
        }

        const fsPath = join(__dirname, "..", path);
        
        if (!existsSync(fsPath)) {
            throw new Error("Update version seems to be broken, a file found in git does not exist");
        }

        let file = readFileSync(fsPath, "utf8");

        
        const versionSection = file.match(/\"version\":\s*\".*\"/);
        if (!versionSection || versionSection === null) {
            continue;   
        }
        const version = versionSection[0].split(":")[1].split("\"")[1];
        
        var sem = new SemVer(version);
        const newVersion = sem.inc("patch");
        console.log(`Workspace ${workspace}, had version ${version}, updating to ${newVersion}`);

        file = file.replace(versionSection[0], `"version": "${newVersion.version}"`);


        writeFileSync(fsPath, file);

        changedWorkspaceVersions.push(workspace);
        console.log(`Updated ${workspace}, adding to git`);
        exec(`git add ${fsPath}`, { silent: true });
    } 

    if (changedWorkspaceVersions.length === 0) {
        console.log("All versions were up to date");
        return;   
    }

    console.log("Amending latest commit");

    const hook = join(__dirname,"..", ".husky", "post-commit");

    exec(` git commit --amend -C HEAD --no-verify`, {
        env: {
            CI: "true",
            ...process.env
        },
        silent: true
    });
})();

async function listChangedFiles(): Promise<string[]> {
    var res = exec("git diff-tree --no-commit-id --name-only -r HEAD", { silent: true });
    
    return res.split("\n");
}

function didVersionUpdate(file: string) {
    const allChanges = exec("git log -p -1 HEAD", { silent: true });
    const startOfFileDiff = allChanges.indexOf("@@", allChanges.indexOf(file));
    let endOfFileDiff = allChanges.indexOf("diff --git", startOfFileDiff + 1);

    if (endOfFileDiff === -1) {
        endOfFileDiff = allChanges.length;
    }

    const changes = allChanges.substring(startOfFileDiff, endOfFileDiff);

    return (changes.match(/\+\s*\"version\"/)?.length ?? 0) > 0;
}

// find changed workspaces
async function findChangedWorkspaces() {
    if (!("workspaces" in (packJson as any))) {
        throw new Error("No workspaces in package.json");
    }

    if (!("packages" in (packJson as any).workspaces)) {
        throw new Error("No packages in workspaces");
    }

    const workspaces = (packJson as any).workspaces.packages;

    const changedFiles = await listChangedFiles();
    const changedWorkspaces = [];

    for (const file of changedFiles) {
        const sections = file.split("/");

        let subPaths = [""];
        let path = "";

        for (const section of sections) {
            path = join(path, section);
            subPaths.push(path);
        }
        for (const workspace of workspaces) {
            changedWorkspaces.push(...match(subPaths, workspace));
        }
    }

    return [...new Set(changedWorkspaces)];
}