import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";

export function createSearchIcon(style?: ViewStyle | TextStyle) {
    return (<Icon
        name={"search"}
        tvParallaxProperties={undefined}
        style={style} />
    )
}

export function createClearIcon(size?: number, style?: ViewStyle | TextStyle) {
    return (<Icon
        name={"close"}
        tvParallaxProperties={undefined}
        style={style}
        size={size} />
    )
}