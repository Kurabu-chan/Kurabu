import { PaletteToken } from "../Tokens";
import { palettes, paletteShades } from "./colors";

export type PaletteKeys = typeof palettes[number];
export type PaletteShade = typeof paletteShades[number];
export type MainColorSets = "background" | "surface" | "primary" | "secondary" | "tertiary";
export type Status = "danger" | "success" | "warning" | "info" | "disabled";

export type Colors = {
    colors: SubSets<MainColorSets>
    & {
        status: Record<Status, ColorSet>,
        labels: PaletteToken[]
    },
    palettes: Record<PaletteKeys, Record<PaletteShade, string>>
}

type SubSets<Name extends string> = Record<`${Name}`, PaletteToken>
    & Record<`${Name}Border`, PaletteToken>
    & Record<`on${Capitalize<Name>}`, TypographicColorSet>
    & Record<`${Name}Container`, PaletteToken>
    & Record<`${Name}ContainerBorder`, PaletteToken>
    & Record<`on${Capitalize<Name>}Container`, TypographicColorSet>
    & Record<`${Name}Gradient`, Gradient>;

export type ColorSet = {
    color: PaletteToken,
    border: PaletteToken,
    text: TypographicColorSet,
}

export type TypographicColorSet = {
    header: PaletteToken,
    paragraph: PaletteToken,
    link: PaletteToken,
    linkActive: PaletteToken,
    subText: PaletteToken,
}

export type Gradient = {
    start: PaletteToken,
    second: PaletteToken,
}
