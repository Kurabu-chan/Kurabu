import { Theme } from "./Theme";

/**
 * A set of themes, it always includes a default theme but may have any number of other themes
 *
 * @category General Use
 */
export type ThemeSet = {
    [index: string]: Theme;
    default: Theme;
}

/**
 * retrieve a theme from a theme set
 *
 * @returns default theme if unknown theme is requested
 * @category Advanced Use
 */
export function getTheme(themeName: string, themeSet: ThemeSet): Theme {
    if (themeSet[themeName]) {
        return themeSet[themeName];
    }
    return themeSet.default;
}

/**
 * Add a theme to a themeset
 *
 * @category General Use
 */
export function addTheme(themeName:string, theme: Theme, themeSet: ThemeSet): void {
    themeSet[themeName] = theme;
}
