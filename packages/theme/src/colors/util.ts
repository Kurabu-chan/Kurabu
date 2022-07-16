import { PaletteToken } from "../Tokens";
import { PaletteKeys, PaletteShade } from ".";

export function parsePaletteColor(paletteRef: PaletteToken): [PaletteKeys, PaletteShade] {
    const [, , , paletteKey, shade] = paletteRef.split(".");
    return [paletteKey as PaletteKeys, parseInt(shade, 10) as PaletteShade];
}

