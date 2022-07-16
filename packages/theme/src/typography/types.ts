import { typographyScales } from "./typography";

export type TypographyScales = typeof typographyScales[number];

export type FontWeight =
    "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
export type FontStyle = "normal" | "italic";
export type FontCasing = "Sentence" | "AllCaps";


export type TypographyScale = {
    fontFamily: string;
    fontWeight: FontWeight;
    fontSize: number;
    letterSpacing: number;
    fontStyle: "normal" | "italic",
    case: "Sentence" | "AllCaps"
}


export type Typography = {
    scales: Record<TypographyScales, TypographyScale>
}

