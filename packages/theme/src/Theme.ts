import React, { useContext, createContext, useState, createElement } from "react";
import { Colors } from "./colors";
import { defaultTheme } from "./defaultTheme";
import { TokenReference, tokenSymbol } from "./Tokens";
import { Typography } from "./typography";
import { IUIScaling, ReactDomUIScaling } from "./scaling";
import { Sizing } from "./sizing";

export type Theme = {
    typography: Typography;
    colors: Colors;
    sizing: Sizing;
}

export type ProvidedTheme = {
    theme: Theme;
    viewPort: ViewPort;
    scaling: IUIScaling;
    setTheme: (theme: Theme) => void;
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
    viewPort: {
        densityIndependentHeight: 0,
        densityIndependentWidth: 0,
        pixelHeight: 0,
        pixelWidth: 0,
    }
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
    applyTheme(styles as Record<string | number, unknown>, context);

    return styles;
}

function applyTheme(obj: Record<string|number, unknown>, theme: ProvidedTheme) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];

            if (typeof element === "object" && element !== null) {
                if (tokenSymbol in element) {
                    const tokenReference = element as TokenReference;
                    const token = tokenReference[tokenSymbol];

                    if (token === undefined) {
                        continue;
                    }

                    if (!token.startsWith("themed")) {
                        continue;
                    }

                    obj[key] = tokenReference.resolve(theme);
                    continue;
                }

                applyTheme(element as Record<string, unknown>, theme);
                continue;
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ThemeProvider(scaling: IUIScaling, customTheme?: Theme, customViewport?: ViewPort) {
    const [theme, setTheme] = useState<Theme>(customTheme ?? defaultTheme);
    const [viewPort, setViewPort] = useState<ViewPort>(customViewport ?? defaultViewPort);

    return createElement(themeContext.Provider, {
        value: {
            scaling,
            setTheme,
            setViewPort,
            theme,
            viewPort,
        }
    });
}
