import { randomInt } from "crypto";
import { ProvidedTheme } from "../Theme";
import { ColorToken, isToken, PaletteToken, SpecificTokenSetting, SpecificTokenTypeSet, TokenReference } from "../Tokens";
import { indexWalk } from "../util";

export const palettes =
    ["gray", "blue", "green", "yellow", "orange", "red", "purple", "pink", "coral"] as const;
export const paletteShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveColor(
    typeSet: SpecificTokenTypeSet<ColorToken>,
    setting: SpecificTokenSetting<ColorToken>,
    theme: ProvidedTheme
): any {

    if (typeSet === "labels") {
        const labels = theme.theme.colors.colors.labels;
        const r = randomInt(labels.length);


        return new TokenReference(labels[r]).resolve(theme);
    }


    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const walked = indexWalk(theme.theme.colors.colors[typeSet], setting?.split("."));

    if (typeof walked != "string") {
        throw new Error(`Invalid color reference: ${typeSet}.${setting??""}`);
    }

    if (isToken(walked)) {
        return new TokenReference(walked).resolve(theme);
    }

    if (typeof walked !== "string") {
        throw new Error(`Invalid color reference: ${typeSet}.${setting ?? ""}`);
    }

    return walked;
}

export function resolvePalette(
    typeSet: SpecificTokenTypeSet<PaletteToken>,
    setting: SpecificTokenSetting<PaletteToken>,
    theme: ProvidedTheme
): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const walked = indexWalk(theme.theme.colors.palettes[typeSet], setting.split("."));

    if (typeof walked != "string") {
        throw new Error("Invalid palette reference: " + setting);
    }

    if (isToken(walked)) {
        return new TokenReference(walked).resolve(theme);
    }

    if (typeof walked !== "string") {
        throw new Error("Invalid color reference: " + setting);
    }

    return walked;
}

