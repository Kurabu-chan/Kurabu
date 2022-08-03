import { sync as inPath } from "hasbin";
import { green } from "chalk"
import { exec } from "child_process";
import { execute } from "./lib/execute";
import { privateEncrypt } from "crypto";
import { existsSync, fstat } from "fs";

// Check if emulator is in path
const emulatorInPath = inPath("emulator")
if (!emulatorInPath) {
    console.error("❌ Android emulator is not installed")
} else {
    console.log(green("✅ Android emulator is installed"))

    // Check if emulator has an emulator with name 'kurabu'
    execute("emulator -list-avds", (data) => {
        if (data.includes("kurabu"))
            console.log(green("✅ An Android emulator named 'kurabu' is installed"))
        else
            console.error("❌ An Android emulator named 'kurabu' is not installed")
    })
}

// check if yarn is installed on the correct version
const yarnInPath = inPath("yarn")

if (!yarnInPath) {
    console.error("❌ Yarn is not installed")
}
else {
    console.log(green("✅ Yarn is installed"))
    execute("yarn --version", (data) => {
        if (data.includes("1.22."))
            console.log(green("✅ Yarn is installed on the correct version"))
        else
            console.error("❌ Yarn is installed on the wrong version")
    })

    // Check if turbo binary is available
    execute("cd .. && yarn bin turbo", (data) => {
        if (data.includes("node_modules\\.bin\\turbo"))
            console.log(green("✅ Turbo is installed"))
        else
            console.error("❌ Turbo is not installed")
    })

}

if (existsSync("../node_modules")) {
    if (existsSync("../node_modules/turbo")) {
        console.log(green("✅ Node modules are installed"))
    } else { 
        console.error("❌ Node modules are not installed")
    }
} else { 
    console.error("❌ Node modules are not installed")
}



// Check if node_modules exists and is not empty

