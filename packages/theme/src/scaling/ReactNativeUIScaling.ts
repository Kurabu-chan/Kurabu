import { Box } from "../util";
import { ProvidedTheme } from "../Theme";
import { IUIScaling } from ".";

export class ReactNativeUIScaling implements IUIScaling {
    constructor(private roundToNearestPixel: (num: number) => number) {

    }

    scaleBox(box: Box<number>, theme: ProvidedTheme): Box<number> {
        return {
            height: this.calculateHeight(box.height, theme),
            width: this.calculateWidth(box.width, theme),
        };
    }
    scaleFont(size: number): number {
        return size;
    }
    scaleLetterSpacing(size: number): number {
        return size;
    }

    scaleVw(size: number, plus: number, theme: ProvidedTheme): number {
        return this.roundToNearestPixel(
            (theme.viewPort.densityIndependentWidth * size / 100) + this.scaleSpacing(plus, theme));
    }

    scaleVh(size: number, plus: number, theme: ProvidedTheme): number {
        return this.roundToNearestPixel(
            (theme.viewPort.densityIndependentHeight * size / 100)
            + this.scaleSpacing(plus, theme));
    }

    scaleSpacing(spacing: number, theme: ProvidedTheme): number {
        const ratio = (
            (theme.viewPort.densityIndependentWidth + theme.viewPort.densityIndependentHeight) / 2)
            / ((theme.viewPort.pixelWidth + theme.viewPort.pixelHeight) / 2);

        return this.roundToNearestPixel(spacing * ratio);
    }

    private calculateHeight(height: number, theme: ProvidedTheme) {
        return this.roundToNearestPixel(
            (height / theme.viewPort.pixelHeight) * theme.viewPort.densityIndependentHeight);
    }

    private calculateWidth(width: number, theme: ProvidedTheme) {
        return this.roundToNearestPixel(
            (width / theme.viewPort.pixelWidth) * theme.viewPort.densityIndependentWidth);
    }
}
