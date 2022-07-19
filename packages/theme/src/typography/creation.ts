import { TokenReference } from "../Tokens";
import { FontCasing, FontStyle, FontWeight, TypographyScales } from "./types";

/**
 * All functions used for creating typography tokens.
 * These can be used inside your styles
 *
 * @category General Use
 */
export const typography = {
    case(scale: TypographyScales): FontCasing {
        return new TokenReference(`themed.ref.typ.scales.${scale}.case`) as unknown as FontCasing;
    },
    fontFamily(scale: TypographyScales): string {
        return new TokenReference(`themed.ref.typ.scales.${scale}.fontFamily`) as unknown as string;
    },
    fontSize(scale: TypographyScales): number {
        return new TokenReference(`themed.ref.typ.scales.${scale}.fontSize`) as unknown as number;
    },
    fontStyle(scale: TypographyScales): FontStyle {
        return new TokenReference(`themed.ref.typ.scales.${scale}.fontStyle`) as unknown as FontStyle;
    },
    fontWeight(scale: TypographyScales): FontWeight {
        return new TokenReference(`themed.ref.typ.scales.${scale}.fontWeight`) as unknown as FontWeight;
    },
    letterSpacing(scale: TypographyScales): number {
        return new TokenReference(`themed.ref.typ.scales.${scale}.letterSpacing`) as unknown as number;
    },
};
