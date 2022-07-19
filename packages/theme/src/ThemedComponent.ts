import React from "react";
import { AppliedStyles, ProvidedTheme, ThemeApplier } from "./Theme";

/**
 * Abstract react component that should be inehrited from for theming in class components.
 *
 * @category General Use
 * @example
 * ```tsx
 *  type Props = {
 *      buttonText: string
 *  }
 *
 *  class CoolComponent extends ThemedComponent<Styles, Props>{
 *      constructor(props: Props){
 *          super(styles, props);
 *      }
 *
 *      renderThemed(styles: AppliedStyles<Styles>){
 *          return (
 *              <button style={styles.button}>
 *                  {this.props.buttonText}
 *              </button>
 *         );
 *      }
 *  }
 *
 *  type Styles = typeof styles;
 *
 *  const styles = {
 *      button: {
 *          backgroundColor: colors.color("primary"),
 *          color: colors.onColor("primary"),
 *      }
 *  });
 * ```
 */
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
