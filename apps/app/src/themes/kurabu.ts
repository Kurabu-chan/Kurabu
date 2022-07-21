import { addTheme, Theme, ThemeSet } from "@kurabu/theme";
import { kurabuPalette } from "./palettes/kurabu";

export function addKurabuTheme(themeSet: ThemeSet) {
    const theme: Theme = {
        colors: {
            colors: {
                background: "themed.ref.pal.gray.900",
                backgroundBorder: "themed.ref.pal.gray.900",
                backgroundContainer: "themed.ref.pal.gray.800",
                backgroundContainerBorder: "themed.ref.pal.gray.800",
                backgroundGradient: {
                    second: "themed.ref.pal.gray.900",
                    start: "themed.ref.pal.gray.800"
                },
                onBackground: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.100",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },
                onBackgroundContainer: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },

                surface: "themed.ref.pal.gray.800",
                surfaceBorder: "themed.ref.pal.gray.700",
                surfaceContainer: "themed.ref.pal.gray.600",
                surfaceContainerBorder: "themed.ref.pal.gray.500",
                surfaceGradient: {
                    second: "themed.ref.pal.gray.800",
                    start: "themed.ref.pal.gray.700"
                },
                onSurface: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },
                onSurfaceContainer: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },

                primary: "themed.ref.pal.pink.500",
                primaryBorder: "themed.ref.pal.pink.500",
                primaryContainer: "themed.ref.pal.pink.700",
                primaryContainerBorder: "themed.ref.pal.pink.700",
                primaryGradient: {
                    second: "themed.ref.pal.pink.500",
                    start: "themed.ref.pal.pink.600"
                },
                onPrimary: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },
                onPrimaryContainer: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },


                secondary: "themed.ref.pal.pink.700",
                secondaryBorder: "themed.ref.pal.gray.700",
                secondaryContainer: "themed.ref.pal.gray.900",
                secondaryContainerBorder: "themed.ref.pal.gray.900",
                secondaryGradient: {
                    second: "themed.ref.pal.pink.700",
                    start: "themed.ref.pal.pink.800"
                },
                onSecondary: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },
                onSecondaryContainer: {
                    header: "themed.ref.pal.gray.50",
                    link: "themed.ref.pal.gray.50",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.50",
                    subText: "themed.ref.pal.gray.50",
                },

                tertiary: "themed.ref.pal.gray.900",
                tertiaryBorder: "themed.ref.pal.gray.900",
                tertiaryContainer: "themed.ref.pal.gray.700",
                tertiaryContainerBorder: "themed.ref.pal.gray.700",
                tertiaryGradient: {
                    second: "themed.ref.pal.gray.900",
                    start: "themed.ref.pal.gray.800"
                },
                onTertiary: {
                    header: "themed.ref.pal.gray.100",
                    link: "themed.ref.pal.gray.100",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.100",
                    subText: "themed.ref.pal.gray.100",
                },
                onTertiaryContainer: {
                    header: "themed.ref.pal.gray.100",
                    link: "themed.ref.pal.gray.100",
                    linkActive: "themed.ref.pal.gray.200",
                    paragraph: "themed.ref.pal.gray.100",
                    subText: "themed.ref.pal.gray.100",
                },

                labels: [
                    "themed.ref.pal.blue.300",
                    "themed.ref.pal.green.300",
                    "themed.ref.pal.orange.300",
                    "themed.ref.pal.pink.300",
                    "themed.ref.pal.coral.300",
                    "themed.ref.pal.purple.300",
                    "themed.ref.pal.red.300",
                    "themed.ref.pal.yellow.300"
                ],

                status: {
                    danger: {
                        border: "themed.ref.pal.red.500",
                        color: "themed.ref.pal.red.500",
                        text: {
                            header: "themed.ref.pal.gray.100",
                            link: "themed.ref.pal.gray.100",
                            linkActive: "themed.ref.pal.gray.100",
                            paragraph: "themed.ref.pal.gray.100",
                            subText: "themed.ref.pal.gray.100",
                        }
                    },
                    disabled: {
                        border: "themed.ref.pal.gray.500",
                        color: "themed.ref.pal.gray.500",
                        text: {
                            header: "themed.ref.pal.gray.100",
                            link: "themed.ref.pal.gray.100",
                            linkActive: "themed.ref.pal.gray.100",
                            paragraph: "themed.ref.pal.gray.100",
                            subText: "themed.ref.pal.gray.100",
                        }
                    },
                    info: {
                        border: "themed.ref.pal.blue.400",
                        color: "themed.ref.pal.blue.400",
                        text: {
                            header: "themed.ref.pal.gray.900",
                            link: "themed.ref.pal.gray.900",
                            linkActive: "themed.ref.pal.gray.900",
                            paragraph: "themed.ref.pal.gray.900",
                            subText: "themed.ref.pal.gray.900",
                        }
                    },
                    success: {
                        border: "themed.ref.pal.green.400",
                        color: "themed.ref.pal.green.400",
                        text: {
                            header: "themed.ref.pal.gray.100",
                            link: "themed.ref.pal.gray.100",
                            linkActive: "themed.ref.pal.gray.100",
                            paragraph: "themed.ref.pal.gray.100",
                            subText: "themed.ref.pal.gray.100",
                        }
                    },
                    warning: {
                        border: "themed.ref.pal.yellow.300",
                        color: "themed.ref.pal.yellow.300",
                        text: {
                            header: "themed.ref.pal.gray.100",
                            link: "themed.ref.pal.gray.100",
                            linkActive: "themed.ref.pal.gray.100",
                            paragraph: "themed.ref.pal.gray.100",
                            subText: "themed.ref.pal.gray.100",
                        }
                    }
                }
            },
            palettes: kurabuPalette,
        },
        sizing: {
            rounding: {
                "extraLarge": 16,
                "extraSmall": 3,
                full: 100000000,
                large: 12,
                medium: 8,
                none: 0,
                small: 6,
            },
            spacing: {
                "halfLarge": 8,
                "halfMedium": 5,
                "halfSmall": 2,
                large: 16,
                medium: 10,
                small: 4,
            }
        },
        typography: {
            scales: {
                body1: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0.5,
                },
                body2: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 14,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0.25,
                },
                button: {
                    case: "AllCaps",
                    fontFamily: "Roboto",
                    fontSize: 14,
                    fontStyle: "normal",
                    fontWeight: "500",
                    letterSpacing: 1.25,
                },
                caption: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 12,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0.4,
                },
                headline1: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 96,
                    fontStyle: "normal",
                    fontWeight: "300",
                    letterSpacing: -1.5,
                },
                headline2: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 60,
                    fontStyle: "normal",
                    fontWeight: "300",
                    letterSpacing: -0.5,
                },
                headline3: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 48,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0,
                },
                headline4: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 34,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0.25,
                },
                headline5: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 24,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0,
                },
                headline6: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: "500",
                    letterSpacing: 0.15,
                },
                overline: {
                    case: "AllCaps",
                    fontFamily: "Roboto",
                    fontSize: 10,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 1.5,
                },
                subtitle1: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: "400",
                    letterSpacing: 0.15,
                },
                subtitle2: {
                    case: "Sentence",
                    fontFamily: "Roboto",
                    fontSize: 14,
                    fontStyle: "normal",
                    fontWeight: "500",
                    letterSpacing: 0.1,
                },
            }
        }
    }

    addTheme("kurabu", theme, themeSet);

    return theme;
}
