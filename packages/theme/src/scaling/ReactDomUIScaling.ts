import { Box } from "../util";
import { ProvidedTheme } from "../Theme";
import { IUIScaling } from ".";

/**
 * Class used for deciding the scaling of the UI where react dom is used.
 *
 * @category General Use
 */
export class ReactDomUIScaling implements IUIScaling {
    scaleBox(box: Box<number>, theme: ProvidedTheme): Box<string> {
        const ratio = this.getRatio(theme);

        return {
            height: `${Math.round(ratio * box.height)}px`,
            width: `${Math.round(ratio * box.width)}px`,
        };
    }
    scaleFont(size: number, theme: ProvidedTheme): string {
        const ratio = this.getRatio(theme);

        return `${Math.round(size * ratio)}px`;
    }
    scaleLetterSpacing(size: number, theme: ProvidedTheme): string {
        const ratio = this.getRatio(theme);

        return `${Math.round(size * ratio)}px`;
    }

    scaleVw(size: number, plus: number): string {
        if (plus === 0) {
            return `${size}vw`;
        }

        if (plus > 0) {
            return `calc(${size}vw + ${plus}px)`;
        }
        return `calc(${size}vw - ${Math.abs(plus)}px)`;
    }

    scaleVh(size: number, plus: number): string {
        if (plus === 0) {
            return `${size}vh`;
        }

        if (plus > 0) {
            return `calc(${size}vh + ${plus}px)`;
        }
        return `calc(${size}vh - ${Math.abs(plus)}px)`;
    }

    scaleSpacing(spacing: number, theme: ProvidedTheme): string {
        const ratio = this.getRatio(theme);

        return `${Math.round(spacing * ratio)}px`;
    }

    private getRatio(theme: ProvidedTheme) {
        return ((theme.viewPort.pixelWidth / 1920) + (theme.viewPort.pixelHeight / 1080)) / 2;
    }
}
