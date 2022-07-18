import React from "react";
import { AppliedStyles, ProvidedTheme, ThemeApplier } from "./Theme";

export abstract class ThemedComponent<TStyle extends Record<string | number,
Record<string, unknown>>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    P = {}, S = {}, SS = {}>
    extends React.Component<P, S, SS> {
    constructor(private _style: TStyle, props: P) {
        super(props);
    }

    render() {
        return React.createElement(ThemeApplier, {
            children: ({ styles, theme}) => {
                return this.renderThemed(styles as AppliedStyles<TStyle>, theme);
            },
            style: this._style,
        });
    }

    abstract renderThemed(styles: AppliedStyles<TStyle>, theme: ProvidedTheme): JSX.Element;
}
