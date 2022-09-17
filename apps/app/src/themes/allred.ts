import { Theme } from "@kurabu/theme";
import { commonSizing, commonTypography } from "./common";
import { kurabuPalette } from "./palettes/kurabu";

const allredTheme: Theme = {
	colors: {
		colors: {
			background: "themed.ref.pal.red.400",
			backgroundBorder: "themed.ref.pal.red.400",
			backgroundContainer: "themed.ref.pal.red.400",
			backgroundContainerBorder: "themed.ref.pal.red.400",
			backgroundGradient: {
				second: "themed.ref.pal.red.400",
				start: "themed.ref.pal.red.400"
			},
			onBackground: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},
			onBackgroundContainer: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},

			surface: "themed.ref.pal.red.400",
			surfaceBorder: "themed.ref.pal.red.400",
			surfaceContainer: "themed.ref.pal.red.400",
			surfaceContainerBorder: "themed.ref.pal.red.400",
			surfaceGradient: {
				second: "themed.ref.pal.red.400",
				start: "themed.ref.pal.red.400"
			},
			onSurface: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},
			onSurfaceContainer: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},

			primary: "themed.ref.pal.red.400",
			primaryBorder: "themed.ref.pal.red.400",
			primaryContainer: "themed.ref.pal.red.400",
			primaryContainerBorder: "themed.ref.pal.red.400",
			primaryGradient: {
				second: "themed.ref.pal.red.400",
				start: "themed.ref.pal.red.400"
			},
			onPrimary: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},
			onPrimaryContainer: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},


			secondary: "themed.ref.pal.red.400",
			secondaryBorder: "themed.ref.pal.red.400",
			secondaryContainer: "themed.ref.pal.red.400",
			secondaryContainerBorder: "themed.ref.pal.red.400",
			secondaryGradient: {
				second: "themed.ref.pal.red.400",
				start: "themed.ref.pal.red.400"
			},
			onSecondary: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},
			onSecondaryContainer: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},

			tertiary: "themed.ref.pal.red.400",
			tertiaryBorder: "themed.ref.pal.red.400",
			tertiaryContainer: "themed.ref.pal.red.400",
			tertiaryContainerBorder: "themed.ref.pal.red.400",
			tertiaryGradient: {
				second: "themed.ref.pal.red.400",
				start: "themed.ref.pal.red.400"
			},
			onTertiary: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},
			onTertiaryContainer: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},

			labels: [
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400",
				"themed.ref.pal.red.400"
			],
			onLabels: {
				header: "themed.ref.pal.red.400",
				link: "themed.ref.pal.red.400",
				linkActive: "themed.ref.pal.red.400",
				paragraph: "themed.ref.pal.red.400",
				subText: "themed.ref.pal.red.400",
			},

			status: {
				danger: {
					border: "themed.ref.pal.red.400",
					color: "themed.ref.pal.red.400",
					text: {
						header: "themed.ref.pal.red.400",
						link: "themed.ref.pal.red.400",
						linkActive: "themed.ref.pal.red.400",
						paragraph: "themed.ref.pal.red.400",
						subText: "themed.ref.pal.red.400",
					}
				},
				disabled: {
					border: "themed.ref.pal.red.400",
					color: "themed.ref.pal.red.400",
					text: {
						header: "themed.ref.pal.red.400",
						link: "themed.ref.pal.red.400",
						linkActive: "themed.ref.pal.red.400",
						paragraph: "themed.ref.pal.red.400",
						subText: "themed.ref.pal.red.400",
					}
				},
				info: {
					border: "themed.ref.pal.red.400",
					color: "themed.ref.pal.red.400",
					text: {
						header: "themed.ref.pal.red.400",
						link: "themed.ref.pal.red.400",
						linkActive: "themed.ref.pal.red.400",
						paragraph: "themed.ref.pal.red.400",
						subText: "themed.ref.pal.red.400",
					}
				},
				success: {
					border: "themed.ref.pal.red.400",
					color: "themed.ref.pal.red.400",
					text: {
						header: "themed.ref.pal.red.400",
						link: "themed.ref.pal.red.400",
						linkActive: "themed.ref.pal.red.400",
						paragraph: "themed.ref.pal.red.400",
						subText: "themed.ref.pal.red.400",
					}
				},
				warning: {
					border: "themed.ref.pal.red.400",
					color: "themed.ref.pal.red.400",
					text: {
						header: "themed.ref.pal.red.400",
						link: "themed.ref.pal.red.400",
						linkActive: "themed.ref.pal.red.400",
						paragraph: "themed.ref.pal.red.400",
						subText: "themed.ref.pal.red.400",
					}
				}
			}
		},
		palettes: kurabuPalette,
	},
	sizing: commonSizing,
	typography: commonTypography
}

export const allredThemeName = "allred";
export default allredTheme;
