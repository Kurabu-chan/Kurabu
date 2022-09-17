import { ProvidedTheme } from "../Theme";
import { SizingToken, SpecificTokenSetting, SpecificTokenTypeSet } from "../Tokens";
import { Rounding, Spacing } from "./types";

/**
 * @hidden
 */
export function resolveSizing(
    typeSet: SpecificTokenTypeSet<SizingToken>,
    setting: SpecificTokenSetting<SizingToken>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: ProvidedTheme): any {

    if (typeSet === "rounding") {
        return theme.theme.sizing.rounding[setting as Rounding];
    }

    if (typeSet === "spacing") {
        return theme.scaling.scaleSpacing(theme.theme.sizing.spacing[setting as Spacing], theme);
    }

    if (typeSet === "vh" || typeSet === "vw") {
        const vhParts = setting.split(".");

        let plus = 0;
        let num = 0;

        if (vhParts.length > 1) {

            if (!vhParts[1].includes("u")) {
                plus = parseInt((vhParts.slice(2).join("."))
                    .replace("minus.", "-")
                    .replace("plus.", ""), 10);
                num = parseFloat(vhParts[0] + "." + vhParts[1]);
            } else {
                plus = parseInt((vhParts.slice(1).join("."))
                    .replace("minus.", "-")
                    .replace("plus.", ""), 10);
                num = parseFloat(vhParts[0]);
            }
        } else {
            if (vhParts.length > 1) {
                num = parseFloat(vhParts[0] + "." + vhParts[1]);
            } else {
                num = parseFloat(vhParts[0]);
            }
        }

        if (typeSet === "vh") {
            return theme.scaling.scaleVh(num, plus, theme);
        }

        return theme.scaling.scaleVw(num, plus, theme);
    }


    return theme;
}
