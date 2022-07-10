export const palettes =
    ["gray", "blue", "green", "yellow", "orange", "red", "purple", "pink", "coral"] as const;
export const paletteShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type PaletteKeys = typeof palettes[number];
export type PaletteShade = typeof paletteShades[number];
export type PaletteColor = `${PaletteKeys}-${PaletteShade}`;

// #region maps

const paletteColorToSymbolMap: Record<PaletteColor, symbol> =
    createPaletteReferences();
const symbolToPaletteColorMap: Record<symbol, PaletteColor> =
    createSymbolToPaletteColorMap();

function createPaletteReferences() {
    const partialPaletteReferences: Partial<Record<PaletteColor, symbol>> = {};
    for (const palette of palettes) {
        for (const shade of paletteShades) {
            partialPaletteReferences[`${palette}-${shade}`] = Symbol(`${palette}-${shade}`);
        }
    }

    return partialPaletteReferences as Record<PaletteColor, symbol>;
}

function createSymbolToPaletteColorMap() {
    const symbolToNameMap: Record<symbol, PaletteColor> = {};
    for (const [paletteRef, symbol] of Object.entries(paletteColorToSymbolMap)) {
        symbolToNameMap[symbol] = paletteRef as PaletteColor;
    }

    return symbolToNameMap;
}

// #endregion

export function toReference(paletteColor: PaletteColor) {
    return paletteColorToSymbolMap[paletteColor];
}

export function fromReference(reference: symbol) {
    return symbolToPaletteColorMap[reference];
}

export function parsePaletteColor(paletteRef: PaletteColor): [PaletteKeys, PaletteShade] {
    const [paletteKey, shade] = paletteRef.split("-");
    return [paletteKey as PaletteKeys, parseInt(shade, 10) as PaletteShade];
}

// #region colorOperations
export function lighten(paletteRef: symbol, amount = 1): PaletteColor {
    const [paletteKey, shade] = parsePaletteColor(fromReference(paletteRef));

    const shadeIndex = paletteShades.indexOf(shade);

    const lightenedIndex = Math.max(0, shadeIndex - amount);

    return `${paletteKey}-${paletteShades[lightenedIndex]}`;
}

export function darken(paletteRef: symbol, amount = 1): PaletteColor {
    const [paletteKey, shade] = parsePaletteColor(fromReference(paletteRef));

    const shadeIndex = paletteShades.indexOf(shade);

    const darkenedIndex = Math.min(paletteShades.length, shadeIndex + amount);

    return `${paletteKey}-${paletteShades[darkenedIndex]}`;
}

// #endregion

export function fromPrimer(primerPalette: Record<string, string | string[]>) {
    const primerPaletteKeys = Object.keys(primerPalette);
    const createdPalette: Partial<Record<PaletteKeys, Partial<Record<PaletteShade, string>>>> = {};


    for (const palette of palettes) {
        if (!(palette in primerPaletteKeys)) {
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

export type Colors = {
    colors: {
        navigation: {
            main: ColorSet,
            primary: ColorSet,
            secondary: ColorSet
        },
        core: {
            main: ColorSet,
            primary: ColorSet,
            secondary: ColorSet
        },
        status: {
            danger: ColorSet,
            success: ColorSet,
            warning: ColorSet,
            info: ColorSet,
            disabled: ColorSet
        },
        labels: PaletteColor[]
    },
    palettes: Record<PaletteKeys, Record<PaletteShade, string>>
}

type ColorSet = {
    color: PaletteColor,
    border: PaletteColor,
    text: TypographicColorSet,
}

type TypographicColorSet = {
    header: PaletteColor,
    paragraph: PaletteColor,
    link: PaletteColor,
    linkHover: PaletteColor,
    subText: PaletteColor,
}
