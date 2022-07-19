import { PaletteKeys, PaletteShade, resolveColor, resolvePalette } from "./colors";
import { resolveSizing, Rounding, Spacing } from "./sizing";
import { ProvidedTheme } from "./Theme";
import { resolveTypography, TypographyScale, TypographyScales } from "./typography";

/**
 * A type fpr all possible palette tokens
 *
 * @category Advanced Use
 */
export type PaletteToken = SpecificToken<"pal", PaletteKeys, `${PaletteShade}`>;

/**
 * A type for all possible color tokens
 *
 * @category Advanced Use
 */
export type ColorToken =
    SpecificToken<"col",
        ColorTokenSet<"background">
        | ColorTokenSet<"surface">
        | ColorTokenSet<"primary">
        | ColorTokenSet<"secondary">
        | ColorTokenSet<"tertiary">
        , undefined>
    | SpecificToken<"col",
        TypographicColorTokenSet<"background">
        | TypographicColorTokenSet<"surface">
        | TypographicColorTokenSet<"primary">
        | TypographicColorTokenSet<"secondary">
        | TypographicColorTokenSet<"tertiary">
        , TypographicColorSetSetting>
    | SpecificToken<"col", "status", `${"danger" | "success" | "warning" | "info" | "disabled"}.${ColorTokenColorSet}`>
    | SpecificToken<"col", "labels", undefined>;
/**
 * All settings on status colors
 *
 * @category Advanced Use
 */
export type ColorTokenColorSet = "color" | "border" | `text.${"header" | "paragraph" | "link" | "linkHover" | "subText"}`;

/**
 * All color sets for each color kind
 *
 * @category Advanced Use
 */
export type ColorTokenSet<Name extends string> = `${Name}` | `${Name}Border` | `${Name}Container` | `${Name}ContainerBorder` | `${Name}Gradient.start` | `${Name}Gradient.second`;
/**
 * A generic type for creating typographic color sets for a color
 *
 * @category Advanced Use
 */
export type TypographicColorTokenSet<Name extends string> = `on${Capitalize<Name>}` | `on${Capitalize<Name>}Container`;

/**
 * All possible properties for a typographic color setting
 *
 * @category Advanced Use
 */
export type TypographicColorSetSetting = "header" |"paragraph" |"link" |"linkActive" |"subText"

/**
 * A type for all possible typography tokens
 *
 * @category Advanced Use
 */
export type TypographyToken = SpecificToken<"typ", "scales", `${TypographyScales}.${keyof TypographyScale}`>;

/**
 * A type for all possible sizing tokens
 *
 * @category Advanced Use
 */
export type SizingToken = SpecificToken<"siz", "vw" | "vh", `${number}`>
    | SpecificToken<"siz", "vw" | "vh", `${number}.${"plus" | "minus"}.${number}`>
    | SpecificToken<"siz", "rounding", Rounding>
    | SpecificToken<"siz", "spacing", Spacing>;

/**
 * A type for any token that does point to a value in the theme
 *
 * @category Advanced Use
 */
export type AnyToken = ColorToken | PaletteToken | TypographyToken | SizingToken;
/**
 * A type for any validly formatted token, even those that do not point to a value in the theme
 *
 * @category Advanced Use
 */
export type Token = SpecificToken<TokenType, string, string | undefined>;
/**
 * A type used for specifying the structure of a specific token
 *
 * @category Advanced Use
 */
export type SpecificToken<Type extends TokenType, TypeSet extends string, Setting extends string | undefined> = Setting extends undefined ? `themed.ref.${Type}.${TypeSet}` : `themed.ref.${Type}.${TypeSet}.${Setting}`;
/**
 * All possible token types in a constant array
 *
 * @category Advanced Use
 */
export const tokenTypes = [
    "col", // color
    "siz", // size
    "pal", // palette
    "typ" // typography
] as const;

/**
 * All possible token types in a type
 *
 * @category Advanced Use
 */
export type TokenType = typeof tokenTypes[number];

/**
 * A function used to create token references
 *
 * @category Advanced Use
 */
export function token<T>(_token: AnyToken): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return new TokenReference(_token) as any;
}

/**
 * A type that extracts the token type from a token
 *
 * @category Advanced Use
 */
export type SpecificTokenType<TToken>
    = TToken extends SpecificToken<infer T, string, string | undefined> ? T : never;
/**
 * A type that extracts the type set from a token
 *
 * @category Advanced Use
 */
export type SpecificTokenTypeSet<TToken>
    = (TToken extends SpecificToken<TokenType, infer T, string | undefined> ? (T extends `${string}.${string}` ? never : T) : never);
/**
 * A type that extracts the setting part from a token
 *
 * @category Advanced Use
 */
export type SpecificTokenSetting<TToken>
    = TToken extends SpecificToken<TokenType, string, infer T> ? T : never;

/**
 * A symbol that should point to a value on every token reference, it can be used to find out if an object is a token reference
 *
 * @category Advanced Use
 */
export const tokenSymbol = Symbol("token");

/**
 * A class that represents a reference to an item within the theme.
 *
 * @category Advanced Use
 */
export class TokenReference<TToken extends Token = AnyToken> {
    [tokenSymbol]: TToken;

    constructor(_token: TToken) {
        this[tokenSymbol] = _token;
    }
    get token(): TToken {
        return this[tokenSymbol];
    }
    get kind(): TokenType {
        return this.token.split(".")[2] as TokenType;
    }
    toString(): string {
        return `TokenReference(${this[tokenSymbol]})`;
    }

    equals(otherToken: TokenReference) {
        return this[tokenSymbol] === otherToken.token;
    }

    parse(kind: TokenType):
        typeof kind extends "col" ? ColorToken
        : typeof kind extends "pal" ? PaletteToken
        : typeof kind extends "typ" ? TypographyToken
        : typeof kind extends "siz" ? SizingToken : never {

        if (this.kind !== kind) throw new Error("Incorrect parse of theme token");

        return this.token as unknown as (typeof kind extends "col" ? ColorToken
            : typeof kind extends "pal" ? PaletteToken
            : typeof kind extends "typ" ? TypographyToken
            : typeof kind extends "siz" ? SizingToken : never);
    }

    split(): [
        SpecificTokenType<TToken>,
        SpecificTokenTypeSet<TToken>,
        SpecificTokenSetting<TToken>
    ] {
        const [, , tokenType, typeSet, ...settings] = this.token.split(".");

        return [
            tokenType as SpecificTokenType<TToken>,
            typeSet as SpecificTokenTypeSet<TToken>,
            settings.join(".") as SpecificTokenSetting<TToken>
        ];
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve(theme: ProvidedTheme): any {
        const [tokenType, typeSet, setting] = this.split();

        switch (tokenType) {
            case "col":
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
                return resolveColor(
                    typeSet as SpecificTokenTypeSet<ColorToken>,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setting as any,
                    theme);
            case "siz":
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
                return resolveSizing(
                    typeSet as SpecificTokenTypeSet<SizingToken>,
                    setting as SpecificTokenSetting<SizingToken>,
                    theme);
            case "pal":
                return resolvePalette(
                    typeSet as SpecificTokenTypeSet<PaletteToken>,
                    setting as SpecificTokenSetting<PaletteToken>,
                    theme);
            case "typ":
                return resolveTypography(
                    typeSet as SpecificTokenTypeSet<TypographyToken>,
                    setting as SpecificTokenSetting<TypographyToken>,
                    theme);
            default:
                throw new Error("Unknown token type");
        }
    }
}

/**
 * A function used to verify if something is a token (not token reference)
 *
 * @category Advanced Use
 */
export function isToken(obj: any): obj is Token {
    if (typeof obj === "string") {
        return obj.startsWith("themed.ref.");
    }
    return false;
}

/**
 * A function used for resolving a token reference to a value
 *
 * @category General Use
 */
export function resolve(obj: any, theme: ProvidedTheme): any {
    if (typeof obj === "object") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if(obj[tokenSymbol] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (obj as TokenReference<AnyToken>).resolve(theme);
        }
    }
}
