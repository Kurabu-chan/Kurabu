import { typographyScales } from "./typography";

/**
 * All the different types of typography in a type
 *
 * @category Advanced Use
 */
export type TypographyScales = typeof typographyScales[number];

/**
 * All the font weights
 *
 * @category General Use
 */
export type FontWeight =
    "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
/**
 * All the font styles
 *
 * @category Advanced Use
 */
export type FontStyle = "normal" | "italic";
/**
 * All the font variants
 *
 * @category Advanced Use
 */
export type FontCasing = "Sentence" | "AllCaps";

/**
 * All the settings for typography
 *
 * @category Advanced Use
 */
export type TypographyScale = {
    fontFamily: string;
    fontWeight: FontWeight;
    fontSize: number;
    letterSpacing: number;
    fontStyle: "normal" | "italic",
    case: "Sentence" | "AllCaps"
}

/**
 * All typography settings
 *
 * @category General Use
 */
export type Typography = {
    scales: Record<TypographyScales, TypographyScale>
}

