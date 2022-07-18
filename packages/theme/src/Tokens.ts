import { PaletteKeys, PaletteShade, resolveColor, resolvePalette } from "./colors";
import { resolveSizing, Rounding, Spacing } from "./sizing";
import { ProvidedTheme } from "./Theme";
import { resolveTypography, TypographyScale, TypographyScales } from "./typography";


export type PaletteToken = SpecificToken<"pal", PaletteKeys, `${PaletteShade}`>;

export type ColorToken =
    SpecificToken<"col",
        ColorSet<"background">
        | ColorSet<"surface">
        | ColorSet<"primary">
        | ColorSet<"secondary">
        | ColorSet<"tertiary">
        , undefined>
    | SpecificToken<"col",
        TypographicColorSet<"background">
        | TypographicColorSet<"surface">
        | TypographicColorSet<"primary">
        | TypographicColorSet<"secondary">
        | TypographicColorSet<"tertiary">
        , TypographicColorSetSetting>
    | SpecificToken<"col", "status", `${"danger" | "success" | "warning" | "info" | "disabled"}.${ColorTokenColorSet}`>
    | SpecificToken<"col", "labels", undefined>;
type ColorTokenColorSet = "color" | "border" | `text.${"header" | "paragraph" | "link" | "linkHover" | "subText"}`;

type ColorSet<Name extends string> = `${Name}` | `${Name}Border` | `${Name}Container` | `${Name}ContainerBorder`;
type TypographicColorSet<Name extends string> = `on${Capitalize<Name>}` | `on${Capitalize<Name>}Container`;
export type TypographicColorSetSetting = "header" |"paragraph" |"link" |"linkActive" |"subText"

export type TypographyToken = SpecificToken<"typ", "scales", `${TypographyScales}.${keyof TypographyScale}`>;

export type SizingToken = SpecificToken<"siz", "vw" | "vh", `${number}`>
    | SpecificToken<"siz", "vw" | "vh", `${number}.${"plus" | "minus"}.${number}`>
    | SpecificToken<"siz", "rounding", Rounding>
    | SpecificToken<"siz", "spacing", Spacing>;

export type AnyToken = ColorToken | PaletteToken | TypographyToken | SizingToken;
export type Token = SpecificToken<TokenType, string, string | undefined>;
export type SpecificToken<Type extends TokenType, TypeSet extends string, Setting extends string | undefined> = Setting extends undefined ? `themed.ref.${Type}.${TypeSet}` : `themed.ref.${Type}.${TypeSet}.${Setting}`;
export const tokenTypes = [
    "col", // color
    "siz", // size
    "pal", // palette
    "typ" // typography
] as const;
export type TokenType = typeof tokenTypes[number];

export function token<T>(_token: AnyToken): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return new TokenReference(_token) as any;
}

export type SpecificTokenType<TToken>
    = TToken extends SpecificToken<infer T, string, string | undefined> ? T : never;
export type SpecificTokenTypeSet<TToken>
    = (TToken extends SpecificToken<TokenType, infer T, string | undefined> ? (T extends `${string}.${string}`? never: T) : never);
export type SpecificTokenSetting<TToken>
    = TToken extends SpecificToken<TokenType, string, infer T> ? T : never;


export const tokenSymbol = Symbol("token");

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

export function isToken(obj: any): obj is Token {
    if (typeof obj === "string") {
        return obj.startsWith("themed.ref.");
    }
    return false;
}

export function resolve(obj: any, theme: ProvidedTheme): any {
    if (typeof obj === "object") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if(obj[tokenSymbol] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (obj as TokenReference<AnyToken>).resolve(theme);
        }
    }
}
