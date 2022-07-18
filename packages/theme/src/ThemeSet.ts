import { Theme } from "./Theme";

export type ThemeSet = {
    [index: string]: Theme;
    default: Theme;
}

/** returns default theme if unknown theme is requested */
export function getTheme(themeName: string, themeSet: ThemeSet): Theme {
    if (themeSet[themeName]) {
        return themeSet[themeName];
    }
    return themeSet.default;
}

export function addTheme(themeName:string, theme: Theme, themeSet: ThemeSet): void {
    themeSet[themeName] = theme;
}
