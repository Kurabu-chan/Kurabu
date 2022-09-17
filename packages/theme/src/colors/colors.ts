import { ProvidedTheme } from "../Theme";
import { ColorToken, ColorTokenTextKind, isToken, PaletteToken, SpecificTokenSetting, SpecificTokenTypeSet, TokenReference } from "../Tokens";
import { indexWalk } from "../util";

/**
 * All palette keys
 *
 * @category Advanced Use
 */
export const palettes =
    ["gray", "blue", "green", "yellow", "orange", "red", "purple", "pink", "coral"] as const;

/**
 * All palette shades
 *
 * @category Advanced Use
 */
export const paletteShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;


/**
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveColor(
    typeSet: SpecificTokenTypeSet<ColorToken>,
    setting: SpecificTokenSetting<ColorToken>,
    theme: ProvidedTheme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {

	if (typeSet === "labels") {


		if (setting === "any") {
			const labels = theme.theme.colors.colors.labels;

			const r = Math.round((Math.random() * labels.length - 0.5));

			return new TokenReference(labels[r]).resolve(theme);
		}

		if (setting?.startsWith("seed")) {
			const labels = theme.theme.colors.colors.labels;

			const seed = parseInt(setting.split(".")[1], 10) % labels.length;

			return new TokenReference(labels[seed]).resolve(theme);
		}

		if (setting === undefined) throw new Error();

		const textKind: ColorTokenTextKind = setting.split(".")[1] as ColorTokenTextKind;

		return new TokenReference(theme.theme.colors.colors.onLabels[textKind]).resolve(theme);
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

/**
 * @hidden
 */
export function resolvePalette(
    typeSet: SpecificTokenTypeSet<PaletteToken>,
    setting: SpecificTokenSetting<PaletteToken>,
    theme: ProvidedTheme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

