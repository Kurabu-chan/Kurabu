import { TokenReference, TypographicColorSetSetting } from "../Tokens";
import { firstUpper } from "../util";
import { MainColorSets, Status } from "./types";

/**
 * All functions used for creating color tokens.
 * These can be used inside your styles
 *
 * @category General Use
 */
export const colors = {
    color(variant: MainColorSets): string {
        return new TokenReference(`themed.ref.col.${variant}`) as unknown as string;
    },
    colorContainer(variant: MainColorSets): string {
        return new TokenReference(`themed.ref.col.${variant}Container`) as unknown as string;
    },
    gradientSecond(variant: MainColorSets): string {
        return new TokenReference(`themed.ref.col.${variant}Gradient.second`) as unknown as string;
    },
    gradientStart(variant: MainColorSets): string {
        return new TokenReference(`themed.ref.col.${variant}Gradient.start`) as unknown as string;
    },
    onColor(variant: MainColorSets, textKind: TypographicColorSetSetting): string {
        return new TokenReference(`themed.ref.col.on${firstUpper(variant)}.${textKind}`) as unknown as string;
    },
    onColorContainer(variant: MainColorSets, textKind: TypographicColorSetSetting): string {
        return new TokenReference(`themed.ref.col.on${firstUpper(variant)}Container.${textKind}`) as unknown as string;
    },


    // eslint-disable-next-line sort-keys
	labels(seed?: number) {
		if (seed === undefined) {
			return new TokenReference("themed.ref.col.labels.any") as unknown as string;
		} else {
			return new TokenReference(`themed.ref.col.labels.seed.${seed}`) as unknown as string;
		}

	},
	// eslint-disable-next-line sort-keys
	onLabels(textKind: TypographicColorSetSetting) {
		return new TokenReference(`themed.ref.col.labels.onLabels.${textKind}`) as unknown as string;
	},

    status(variant: Status,
        section: "border" | "color" | `text.${"header"
            | "paragraph"
            | "link"
            | "linkActive"
            | "subText"}`): string {
        return new TokenReference(`themed.ref.col.status.${variant}.${section}`) as unknown as string;
    }
};

