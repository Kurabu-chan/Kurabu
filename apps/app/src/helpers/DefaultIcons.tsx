import { Colors } from "#config/Colors";
import React from "react";
import { ColorValue, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";

export function createSearchIcon(size?: number, style?: ViewStyle | TextStyle, color: number | ColorValue = Colors.TEXT) {
    return (<Icon
        name={"search"}
        tvParallaxProperties={undefined}
		style={style}
		color={color}
        size={size} />
    )
}

export function createClearIcon(size?: number, style?: ViewStyle | TextStyle, color: number | ColorValue = Colors.TEXT) {
    return (<Icon
        name={"close"}
        tvParallaxProperties={undefined}
        style={style}
		color={color}

        size={size} />
    )
}

export function createIconAnime(size?: number, style?: ViewStyle | TextStyle, color: number | ColorValue = Colors.TEXT) {
    return (
        <Icon
            name="film"
            type="font-awesome-5"
            size={size}
			color={color}
            style={{...styles.noPadding, ...style}}
            tvParallaxProperties={undefined}
        />
    );
}

export function createIconManga(size?: number, style?: ViewStyle | TextStyle, color: number | ColorValue = Colors.TEXT) {
    return (
        <Icon
            name="book"
            type="font-awesome-5"
            size={size}
			color={color}
            style={{ ...styles.noPadding, ...style }}
            tvParallaxProperties={undefined}
        />
    );
}

const styles = StyleSheet.create({
    noPadding: {
        padding: 0,
    }
})
