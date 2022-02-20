import fetch from "node-fetch";
import { match } from "minimatch";
import { join } from "path";
import { parse } from "semver";

const access_token = process.env.GHAPI_ACCESS_TOKEN;
const base = process.env.GHAPI_base;
const head = process.env.GHAPI_head;

if (isEmptyOrUndefined(access_token)) {
    throw new Error("GHAPI_ACCESS_TOKEN is not defined");
}

if (isEmptyOrUndefined(base)) {
    throw new Error("base is not defined");
}

if (isEmptyOrUndefined(head)) {
    throw new Error("head is not defined");
}

(async () => {
    // disable protection
    const contexts = await disableBranchProtection(access_token as string);

    const changedWorkspaces = await findChangedWorkspaces(base as string, head as string);
    const blobs = [];

    //find package.json's for changed workspaces
    for (const workspace of changedWorkspaces) {
        const packJson = await findSubPackageJson(workspace, head as string);
        if (packJson === undefined) {
            continue;
        }
        // construct package'jsons with updated versions
        const version = parse(packJson.json.version);

        if (version === null) {
            throw new Error("Invalid version");
        }
        const newVersion = version?.inc("patch");

        packJson.content = packJson.content.replace(`"version": "${packJson.json.version}"`, `"version": "${newVersion.format()}"`);

        const path = join(workspace, "package.json").replace(/\\/g, "/");
        const blobOut = await createBlob(packJson.content, access_token as string);
        blobs.push({
            sha: blobOut,
            path
        });
    }

    if (blobs.length === 0) {
        console.log("All workspaces are up to date");
        return;
    }

    const branchHead = await getBranchHead();

    const tree = await createTree(blobs, access_token as string, branchHead.treeSha);

    const commit = await createCommit(branchHead.sha, tree, access_token as string);

    

    await updateRef(access_token as string, commit);

    // enable protection
    await enableBranchProtection(access_token as string, contexts);

})();

async function getBranchProtection(access_token: string) {
    const url = `https://api.github.com/repos/Kurabu-chan/Kurabu/branches/main/protection/required_status_checks/contexts`;
    const res = await fetch(url, {
        headers: {
            "Authorization": `token ${access_token}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });

    const json = await res.json();
    if (!Array.isArray(json)) {
        throw new Error("Invalid contexts");
    }
    console.log(json);
    return json as string[];
}

async function disableBranchProtection(access_token: string) {
    // get current contexts
    const contexts = await getBranchProtection(access_token);

    if (contexts === []) {
        console.log("Branch protection is already disabled");
        return [];
    }

    const url = `https://api.github.com/repos/Kurabu-chan/Kurabu/branches/main/protection/required_status_checks/contexts`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `token ${access_token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contexts)
    });
    const json = await res.json();

    if ("message" in json) {
        console.log(json);
        throw new Error("Context delete error");
    }
    return contexts;
}

async function enableBranchProtection(access_token: string, contexts: string[]) {
    if (contexts.length === 0) {
        console.log("No branch protections to enable");
        return;
    }

    const url = `https://api.github.com/repos/Kurabu-chan/Kurabu/branches/main/protection/required_status_checks/contexts`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `token ${access_token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contexts)
    });
    const json = await res.json();
    console.log(json);
}

async function updateRef(access_token: string, commit_sha: string) {
    const url = `https://api.github.com/repos/Kurabu-chan/Kurabu/git/refs/heads/main`;
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `token ${access_token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sha: commit_sha
        })
    });
    const json = await res.json();
}

async function createCommit(head_sha: string, tree_sha: string, access_token: string) {
    const url = `https://api.github.com/repos/Kurabu-chan/Kurabu/git/commits`;
    const body = {
        message: "Update versions",
        tree: tree_sha,
        parents: [
            head_sha
        ],
        author: {
            name: 'kurabu-bot[bot]',
            email: '99994112+kurabu-bot[bot]@users.noreply.github.com',
        }
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `token ${access_token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();

    if (!("sha" in (json as any))) {
        throw new Error("Invalid commit");
    }

    return (json as any).sha;
}

async function createTree(blobs: { sha: string, path: string }[], access_token: string, head_sha: string) {
    const tree = {
        base_tree: head_sha,
        tree: blobs.map((blob) => {
            return {
                path: blob.path,
                mode: "100644",
                type: "blob",
                sha: blob.sha
            }
        })
    }

    const res = await fetch("https://api.github.com/repos/Kurabu-chan/Kurabu/git/trees", {
        method: "POST",
        headers: {
            "Authorization": `token ${access_token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tree)
    });
    const json = await res.json();
    if (!("sha" in (json as any))) {
        throw new Error("Invalid tree");
    }

    return (json as any).sha;
}

async function findChangedWorkspaces(base: string, head: string) {
    const packJson = await getRootPackageJson(head);

    if (!("workspaces" in (packJson as any))) {
        throw new Error("No workspaces in package.json");
    }

    if (!("packages" in (packJson as any).workspaces)) {
        throw new Error("No packages in workspaces");
    }

    const workspaces = (packJson as any).workspaces.packages;

    const changedFiles = await listChangedFiles(base, head);
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

    return changedWorkspaces;
}

async function listChangedFiles(base: string, head: string) {
    const perPage = 100;

    const diffUrl = `https://api.github.com/repos/Kurabu-chan/Kurabu/compare/${base}...${head}?page=1&per_page=${perPage}`;

    const res = await fetch(diffUrl);
    const json = await res.json();

    if (!("files" in (json as any))) {
        throw new Error("Invalid diff");
    }

    return (json as any).files.map((file: any) => file.filename)
}

async function getRootPackageJson(ref?: string) {
    let url = "https://api.github.com/repos/Kurabu-chan/Kurabu/contents/package.json";
    if (ref !== undefined) {
        url += "?ref=" + ref;
    }
    const jsonRes = await (await fetch(url)).json();

    if (!("download_url" in (jsonRes as any))) {
        throw new Error("No download_url for package.json");
    }

    const content = await (await fetch((jsonRes as any).download_url)).json();
    return content as any;
}

async function findSubPackageJson(subDirectory: string, ref?: string) {
    let url = join("https://api.github.com/repos/Kurabu-chan/Kurabu/contents/", subDirectory, "package.json");

    if (ref !== undefined) {
        url += "?ref=" + ref;
    }

    const res = await fetch(url);
    if (res.status !== 200) return undefined;
    const jsonRes = await res.json();

    if (!("download_url" in (jsonRes as any))) {
        throw new Error("No download_url for sub package.json");
    }

    const content = await (await fetch((jsonRes as any).download_url)).text();
    return {
        content: content,
        json: JSON.parse(content),
    };
}

async function getBranchHead(branch: string = "main") {
    let url = `https://api.github.com/repos/Kurabu-chan/Kurabu/branches/${branch}`;

    const res = await fetch(url);
    const json = await res.json();

    if (!("commit" in (json as any))) {
        throw new Error("No commit in branch");
    }

    return {
        sha: (json as any).commit.sha,
        treeSha: (json as any).commit.commit.tree.sha,
        treeUrl: (json as any).commit.commit.tree.url,
    }
}

async function createBlob(content: string, access_token: string) {
    const body = {
        content: content,
        encoding: "utf-8"
    }

    const url = "https://api.github.com/repos/Kurabu-chan/Kurabu/git/blobs";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `token ${access_token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await res.json();
    if (!("sha" in (json as any))) {
        throw new Error("Invalid blob");
    }
    return (json as any).sha as string;
}

function isEmptyOrUndefined(val: any): boolean {
    return val === undefined || val === null || val === "";
}