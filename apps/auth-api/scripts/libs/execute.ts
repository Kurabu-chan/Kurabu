import { spawn } from "child_process";

export function exec(command: string, args: readonly string[] = [], callback?: (code: number | null) => void) {
    const spRet = spawn(command, args, {
        windowsHide: true,
        stdio: "inherit"
    });
    spRet.on('close', (code) => {
        if (callback) callback(code);
    })
}

export function execAsync(command: string, args: readonly string[] = []): Promise<number | null> {
    return new Promise((resolve) => {
        exec(command, args, (code) => {
            resolve(code);
        });
    });
}

export async function execReturnOutputAsync(command: string, args: readonly string[] = []): Promise<string> {
    return new Promise((resolve) => {
        const spRet = spawn(command, args, {
            windowsHide: true
        });

        let stdout = "";

        spRet.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log(data.toString());
        });

        spRet.on('close', (code) => {
            if (code !== 0) {
                console.error(`Command ${command} failed with code ${code}`);
                process.exit(code);
            }
            resolve(stdout);
        });
    });
}