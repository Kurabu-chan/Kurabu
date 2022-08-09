import { ImageStyle, TextStyle, ViewStyle } from "react-native";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export class ThemedStyleSheet { 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static create<T extends NamedStyles<T> | NamedStyles<any>>(styles: T): T { 
        for (const key in styles) {
            if (styles[key]) {
                Object.freeze(styles[key]);
            }
        }
        return styles;
    }
}
