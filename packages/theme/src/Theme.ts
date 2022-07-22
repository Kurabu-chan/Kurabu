import React, { useContext, createContext, useState, createElement } from "react";
import { Colors } from "./colors";
import { defaultTheme } from "./defaultTheme";
import { TokenReference, tokenSymbol } from "./Tokens";
import { Typography } from "./typography";
import { IUIScaling, ReactDomUIScaling } from "./scaling";
import { Sizing } from "./sizing";
import { getTheme, ThemeSet } from "./ThemeSet";

/**
 * A theme is a set of colors, typography, scaling, and sizing
 *
 * @category General Use
 */
export type Theme = {
    typography: Typography;
    colors: Colors;
    sizing: Sizing;
}

/**
 * A theme that is provided to the UI
 *
 * @category General Use
 */
export type ProvidedTheme = {
    theme: Theme;
    themeSet: ThemeSet;
    viewPort: ViewPort;
    scaling: IUIScaling;
    setTheme: (themeName: string) => void;
    setViewPort: (viewPort: ViewPort) => void;
}

/**
 * A type containing the different settings for a viewport
 *
 * @category General Use
 */
export type ViewPort = {
    densityIndependentWidth: number;
    densityIndependentHeight: number;
    pixelWidth: number;
    pixelHeight: number;
}

const defaultViewPort: ViewPort = {
    densityIndependentHeight: 0,
    densityIndependentWidth: 0,
    pixelHeight: 0,
    pixelWidth: 0,
};

const themeContext = createContext<ProvidedTheme>({
    scaling: new ReactDomUIScaling(),
    setTheme: () => { return; },
    setViewPort: () => { return; },
    theme: defaultTheme,
    themeSet: {
        default: defaultTheme,
    },
    viewPort: {
        densityIndependentHeight: 0,
        densityIndependentWidth: 0,
        pixelHeight: 0,
        pixelWidth: 0,
    },
});

/**
 * React hook for getting the full theming context
 *
 * @category Advanced Use
 */
export function useThemeProvider(): ProvidedTheme {
    return useContext(themeContext);
}

/**
 * React hook for applying a theme to a style
 *
 * @category General Use
 */
export function useTheme<T extends StyleType>(styles: T)
    : AppliedStyles<T>{
    const context = useContext(themeContext);
    const applied = applyTheme(styles, context);

    return applied;
}

/**
 * Type for a theming applied to styles.
 * Each key in the object is a style property and the value is an array of two elements, the second the normal styles, the first with the properties that were themed with applied values.
 *
 * @category General Use
 */
export type AppliedStyles<TStyle> = {
    [P in keyof TStyle]: [Partial<TStyle[P]>, TStyle[P]]
}

/**
 * A type representing a style object. It is this obscure since we need to support both ReactDom and ReactNative
 *
 * @category General Use
 */
export type StyleType = Record<string | number, Record<string, unknown>>

function applyTheme<TStyle extends StyleType>
    (obj: TStyle, theme: ProvidedTheme) {
    const retObj: Partial<AppliedStyles<TStyle>> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            retObj[key] = [
                obj[key],
                applySubTheme(obj[key], theme)
            ];
        }
    }

    return retObj as AppliedStyles<TStyle>;
}

/**
 * Apply a theme to a style object, which is not frozen.
 * This allows group resolving of tokens.
 *
 * @category General Use
 */
export function applyUnfrozen<TStyle extends StyleType>(obj: TStyle, theme: ProvidedTheme)
    : TStyle {
    const retObj: Partial<TStyle> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            retObj[key] = {
                ...obj[key],
                ...applySubTheme(obj[key], theme)
            };
        }
    }

    return retObj as TStyle;
}

function applySubTheme<TSubStyle>(obj: TSubStyle, theme: ProvidedTheme): TSubStyle {
    const retObj: Partial<TSubStyle> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            if (typeof element === "object" && element !== null) {
                if (tokenSymbol in element) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const tokenReference = element as any as TokenReference;
                    const token = tokenReference[tokenSymbol];

                    if (token === undefined) {
                        continue;
                    }

                    if (!token.startsWith("themed")) {
                        continue;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    retObj[key] = tokenReference.resolve(theme);

                    continue;
                }
            }

            retObj[key] = element;
        }
    }

    return retObj as TSubStyle;
}

/**
 * Provides a theme context to the component.
 *
 * @category General Use
 *
 * @example
 * ```tsx
 *  function App(){
 *      return (
 *          <ThemeProvider scaling={new ReactDomUIScaling()}>
 *              <RootNavigator />
 *          </ThemeProvider>
 *      );
 *  }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ThemeProvider({ scaling, children, themeSet, customViewport }:
    {
        children: React.ReactNode,
        scaling: IUIScaling,
        themeSet?: ThemeSet,
        customViewport?: ViewPort
    }) {
    // const [theme, setTheme] = useState<Theme>(customTheme ?? defaultTheme);
    const [themeName, setTheme] = useState<keyof ThemeSet>("default");
    const [viewPort, setViewPort] = useState<ViewPort>(customViewport ?? defaultViewPort);

    themeSet = themeSet ?? {
        default: defaultTheme,
    };
    return createElement(themeContext.Provider, {
        children,
        value: {
            scaling,
            setTheme,
            setViewPort,
            theme: getTheme(themeName as string, themeSet),
            themeSet,
            viewPort,
        },
    });
}

/**
 * Provides a theme context to the component.
 *
 * @category Advanced Use
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ThemeConsumer = themeContext.Consumer;

/**
 *
 * Applies theming to a provided style and calls children with the resulting style.
 *
 * @category Advanced Use
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ThemeApplier<TStyle extends Record<string | number, Record<string, unknown>>>
    (props: { style: TStyle } & React.ConsumerProps<{
    styles: AppliedStyles<TStyle>,
    theme: ProvidedTheme,
}>) {
    return createElement(themeContext.Consumer, {
        children: (context: ProvidedTheme) => {
            const style = applyTheme(props.style, context);

            return props.children({
                styles: style,
                theme: context,
            });
        },
    });
}
