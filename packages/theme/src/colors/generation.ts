import { PaletteToken, TokenReference } from "../Tokens";
import { PaletteKeys, PaletteShade } from "./types";
import { parsePaletteColor } from "./util";
import { palettes, paletteShades } from "./";

/**
 * A function that takes a palette color and lightens it by an amount
 *
 * @category Advanced Use
 */
export function lighten(paletteRef: TokenReference, amount = 1): PaletteToken {
    const [paletteKey, shade] = parsePaletteColor(paletteRef.parse("pal"));

    const shadeIndex = paletteShades.indexOf(shade);

    const lightenedIndex = Math.max(0, shadeIndex - amount);

    return `themed.ref.pal.${paletteKey}.${paletteShades[lightenedIndex]}`;
}

/**
 * A function that takes a palette color and darkens it by an amount
 *
 * @category Advanced Use
 */
export function darken(paletteRef: TokenReference, amount = 1): PaletteToken {
    const [paletteKey, shade] = parsePaletteColor(paletteRef.parse("pal"));

    const shadeIndex = paletteShades.indexOf(shade);

    const darkenedIndex = Math.min(paletteShades.length, shadeIndex + amount);

    return `themed.ref.pal.${paletteKey}.${paletteShades[darkenedIndex]}`;
}

/**
 * Take a primer palette and load it into a theme
 *
 * @category General Use
 */
export function fromPrimer(primerPalette: Record<string, string | string[]>) {
    const primerPaletteKeys = Object.keys(primerPalette);
    const createdPalette: Partial<Record<PaletteKeys, Partial<Record<PaletteShade, string>>>> = {};

    for (const palette of palettes) {
        if (!primerPaletteKeys.includes(palette)) {
            throw new Error("Primer palette does not include scale for " + palette);
        }

        const primerScale = primerPalette[palette];

        if (typeof primerScale === "string") {
            throw new Error("Primer scale for " + palette + " is a string, not a list");
        }

        if (primerScale.length !== paletteShades.length) {
            const errMsg = `Primer scale for ${palette} does not have the same number of shades as the theme`;
            throw new Error(errMsg);
        }

        let colorIndex = 0;
        for (const color of primerScale) {
            if (createdPalette[palette] === undefined) {
                createdPalette[palette] = {};
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            createdPalette[palette]![paletteShades[colorIndex]] = color;
            colorIndex++;
        }
    }

    return createdPalette as Record<PaletteKeys, Record<PaletteShade, string>>;
}
