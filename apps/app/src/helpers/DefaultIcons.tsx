import { Colors } from "#config/Colors";
import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";

export function createSearchIcon(size?: number, style?: ViewStyle | TextStyle) {
    return (<Icon
        name={"search"}
        tvParallaxProperties={undefined}
        style={style}
        size={size} />
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

export function createIconAnime(size?: number, style?: ViewStyle | TextStyle) {
    return (
        <Icon
            name="film"
            type="font-awesome-5"
            color={Colors.TEXT}
            size={size}
            style={{...styles.noPadding, ...style}}
            tvParallaxProperties={undefined}
        />
    );
}

export function createIconManga(size?: number, style?: ViewStyle | TextStyle) {
    return (
        <Icon
            name="book"
            type="font-awesome-5"
            color={Colors.TEXT}
            size={size}
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