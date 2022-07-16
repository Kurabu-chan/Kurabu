import { ProvidedTheme } from "../Theme";
import { Box } from "../util";

export interface IUIScaling {
    scaleBox(box: Box<string | number>, theme: ProvidedTheme): Box<string | number>;
    scaleFont(size: number, theme: ProvidedTheme): number|string;
    scaleLetterSpacing(size: number, theme: ProvidedTheme): number | string;
    scaleVw(size: number, plus: number, theme: ProvidedTheme): number | string;
    scaleVh(size: number, plus: number, theme: ProvidedTheme): number | string;
    scaleSpacing(spacing: number, theme: ProvidedTheme): number | string;
}

