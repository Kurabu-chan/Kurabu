import { exec } from "child_process";

export function execute(command: string, callback: (stdout: string) => void) {
    exec(command, function (error, stdout, stderr) { callback(stdout); });
};
