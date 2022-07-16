import { indexWalk } from "../util";
import { ProvidedTheme } from "../Theme";
import { isToken, SpecificTokenSetting, SpecificTokenTypeSet, TokenReference, TypographyToken } from "../Tokens";

export const typographyScales = [
    "headline1",
    "headline2",
    "headline3",
    "headline4",
    "headline5",
    "headline6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "button",
    "caption",
    "overline"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveTypography(
    typeSet: SpecificTokenTypeSet<TypographyToken>,
    setting: SpecificTokenSetting<TypographyToken>,
    theme: ProvidedTheme): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const walked = indexWalk(theme.theme.typography[typeSet], setting.split("."));

    if (isToken(walked)) {
        return new TokenReference(walked).resolve(theme);
    }

    // handle scaled settings differently than other settings
    if (setting.endsWith("fontSize") || setting.endsWith("letterSpacing")) {
        if (typeof walked !== "number") {
            throw new Error("Invalid typography reference: " + setting);
        }

        if (setting.endsWith("fontSize")) {
            return theme.scaling.scaleFont(walked, theme);
        }

        return theme.scaling.scaleLetterSpacing(walked, theme);
    }

    if (typeof walked !== "string") {
        throw new Error("Invalid typography reference: " + setting);
    }

    return walked;
}
