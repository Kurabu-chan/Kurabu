import React, { useContext, createContext, useState, createElement } from "react";
import { Colors } from "./colors";
import { defaultTheme } from "./defaultTheme";
import { TokenReference, tokenSymbol } from "./Tokens";
import { Typography } from "./typography";
import { IUIScaling, ReactDomUIScaling } from "./scaling";
import { Sizing } from "./sizing";
import { getTheme, ThemeSet } from "./ThemeSet";

export type Theme = {
    typography: Typography;
    colors: Colors;
    sizing: Sizing;
}

export type ProvidedTheme = {
    theme: Theme;
    themeSet: ThemeSet;
    viewPort: ViewPort;
    scaling: IUIScaling;
    setTheme: (themeName: string) => void;
    setViewPort: (viewPort: ViewPort) => void;
}

type ViewPort = {
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

export function useThemeProvider(): ProvidedTheme {
    return useContext(themeContext);
}

export function useTheme(styles: Record<string, React.CSSProperties>)
    : Record<string, React.CSSProperties>
export function useTheme(styles: React.CSSProperties)
    : React.CSSProperties
export function useTheme(styles: React.CSSProperties | Record<string, React.CSSProperties>)
    : React.CSSProperties | Record<string, React.CSSProperties>{
    const context = useContext(themeContext);
    applyTheme(styles as Record<string | number, Record<string, unknown>>, context);

    return styles;
}

export type AppliedStyles<TStyle> = {
    [P in keyof TStyle]: [Partial<TStyle[P]>, TStyle[P]]
}

function applyTheme<TStyle extends Record<string | number, Record<string, unknown>>>
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ThemeConsumer = themeContext.Consumer;

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
