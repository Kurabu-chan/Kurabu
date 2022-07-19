import { PaletteToken } from "../Tokens";
import { palettes, paletteShades } from "./colors";

/**
 * All keys for palettes
 *
 * @category Advanced Use
 */
export type PaletteKeys = typeof palettes[number];
/**
 * All shades for palettes
 *
 * @category Advanced Use
 */
export type PaletteShade = typeof paletteShades[number];
/**
 * The main color sets
 *
 * @category Advanced Use
 */
export type MainColorSets = "background" | "surface" | "primary" | "secondary" | "tertiary";
/**
 * The different status kinds
 *
 * @category Advanced Use
 */
export type Status = "danger" | "success" | "warning" | "info" | "disabled";


/**
 * All color settings
 *
 * @category General Use
 */
export type Colors = {
    colors: ColorSubSets<MainColorSets>
    & {
        status: Record<Status, ColorSet>,
        labels: PaletteToken[]
    },
    palettes: Record<PaletteKeys, Record<PaletteShade, string>>
}

/**
 * All color settings for the main color sets
 *
 * @category Advanced Use
 */
export type ColorSubSets<Name extends string> = Record<`${Name}`, PaletteToken>
    & Record<`${Name}Border`, PaletteToken>
    & Record<`on${Capitalize<Name>}`, TypographicColorSet>
    & Record<`${Name}Container`, PaletteToken>
    & Record<`${Name}ContainerBorder`, PaletteToken>
    & Record<`on${Capitalize<Name>}Container`, TypographicColorSet>
    & Record<`${Name}Gradient`, Gradient>;

/**
 * Color settings for status
 *
 * @category Advanced Use
 */
export type ColorSet = {
    color: PaletteToken,
    border: PaletteToken,
    text: TypographicColorSet,
}

/**
 * Color settings for typography
 *
 * @category Advanced Use
 */
export type TypographicColorSet = {
    header: PaletteToken,
    paragraph: PaletteToken,
    link: PaletteToken,
    linkActive: PaletteToken,
    subText: PaletteToken,
}

/**
 * Color settings for gradients
 *
 * @category Advanced Use
 */
export type Gradient = {
    start: PaletteToken,
    second: PaletteToken,
}
