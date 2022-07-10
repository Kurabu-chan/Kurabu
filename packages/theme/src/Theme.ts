import { useContext, createContext, useState, createElement } from "react";
import { Colors, fromPrimer } from "./Colors";
import { Typography } from "./Typography";

export type Theme = {
    typography: Typography;
    colors: Colors;
}

export type ProvidedTheme = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// #region default theme
const defaultPalette = fromPrimer({
    "blue": [
        "#ddf4ff",
        "#b6e3ff",
        "#80ccff",
        "#54aeff",
        "#218bff",
        "#0969da",
        "#0550ae",
        "#033d8b",
        "#0a3069",
        "#002155"
    ],
    "coral": [
        "#fff0eb",
        "#ffd6cc",
        "#ffb4a1",
        "#fd8c73",
        "#ec6547",
        "#c4432b",
        "#9e2f1c",
        "#801f0f",
        "#691105",
        "#510901"
    ],
    "gray": [
        "#f6f8fa",
        "#eaeef2",
        "#d0d7de",
        "#afb8c1",
        "#8c959f",
        "#6e7781",
        "#57606a",
        "#424a53",
        "#32383f",
        "#24292f"
    ],
    "green": [
        "#dafbe1",
        "#aceebb",
        "#6fdd8b",
        "#4ac26b",
        "#2da44e",
        "#1a7f37",
        "#116329",
        "#044f1e",
        "#003d16",
        "#002d11"
    ],
    "orange": [
        "#fff1e5",
        "#ffd8b5",
        "#ffb77c",
        "#fb8f44",
        "#e16f24",
        "#bc4c00",
        "#953800",
        "#762c00",
        "#5c2200",
        "#471700"
    ],
    "pink": [
        "#ffeff7",
        "#ffd3eb",
        "#ffadda",
        "#ff80c8",
        "#e85aad",
        "#bf3989",
        "#99286e",
        "#772057",
        "#611347",
        "#4d0336"
    ],
    "purple": [
        "#fbefff",
        "#ecd8ff",
        "#d8b9ff",
        "#c297ff",
        "#a475f9",
        "#8250df",
        "#6639ba",
        "#512a97",
        "#3e1f79",
        "#2e1461"
    ],
    "red": [
        "#ffebe9",
        "#ffcecb",
        "#ffaba8",
        "#ff8182",
        "#fa4549",
        "#cf222e",
        "#a40e26",
        "#82071e",
        "#660018",
        "#4c0014"
    ],
    "yellow": [
        "#fff8c5",
        "#fae17d",
        "#eac54f",
        "#d4a72c",
        "#bf8700",
        "#9a6700",
        "#7d4e00",
        "#633c01",
        "#4d2d00",
        "#3b2300"
    ],
});

const defaultTheme: Theme = {
    colors: {
        colors: {
            core: {
                main: {
                    border: "gray-900",
                    color: "gray-800",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                primary: {
                    border: "pink-500",
                    color: "pink-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                secondary: {
                    border: "red-500",
                    color: "red-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                }
            },
            labels: [
                "blue-300",
                "green-300",
                "orange-300",
                "pink-300",
                "coral-300",
                "purple-300",
                "red-300",
                "yellow-300"
            ],
            navigation: {
                main: {
                    border: "gray-900",
                    color: "gray-800",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                primary: {
                    border: "pink-500",
                    color: "pink-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                secondary: {
                    border: "red-500",
                    color: "red-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                }
            },
            status: {
                danger: {
                    border: "red-500",
                    color: "red-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                disabled: {
                    border: "gray-500",
                    color: "gray-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                info: {
                    border: "gray-300",
                    color: "gray-400",
                    text: {
                        header: "gray-900",
                        link: "gray-900",
                        linkHover: "gray-900",
                        paragraph: "gray-900",
                        subText: "gray-900",
                    }
                },
                success: {
                    border: "green-500",
                    color: "green-600",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                },
                warning: {
                    border: "yellow-400",
                    color: "yellow-500",
                    text: {
                        header: "gray-100",
                        link: "gray-100",
                        linkHover: "gray-100",
                        paragraph: "gray-100",
                        subText: "gray-100",
                    }
                }
            }
        },
        palettes: defaultPalette,
    },
    typography: {
        fontFamily: "",
        sizes: {
            paragraph: "0",
            title: "0"
        }
    }
};

// #endregion

const themeContext = createContext<ProvidedTheme>({
    setTheme: () => { },
    theme: defaultTheme,
});

export function useTheme(): ProvidedTheme {
    return useContext(themeContext);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ThemeProvider(customTheme?: Theme) {
    const [theme, setTheme] = useState<Theme>(customTheme ?? defaultTheme);

    return createElement(themeContext.Provider, {
        value:{ setTheme, theme }
    });
}
