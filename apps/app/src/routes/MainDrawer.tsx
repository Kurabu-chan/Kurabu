import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { getCurrentBackButtonFunc, registerRerenderer } from "#helpers/backButton";
import MainStack from "./MainStacks/HomeStack";
import RankingStack from "./MainStacks/RankingStack";
import SearchStack from "./MainStacks/SearchStack";
import SeasonalStack from "./MainStacks/SeasonalStack";
import SuggestionsStack from "./MainStacks/SuggestionsStack";
import ListStack from "./MainStacks/ListStack";
import { getListManager } from "#helpers/ListManager";
import { CustomDrawerContentComponent } from "#comps/CustomDrawerNavigator";
import { applyUnfrozen, colors, ProvidedTheme, sizing, ThemedComponent, typography } from "@kurabu/theme";

export const Drawer = createDrawerNavigator();

type Props = unknown;

// eslint-disable-next-line @typescript-eslint/ban-types
export default class DrawerComp extends ThemedComponent<{}, Props> {
    constructor(props: Props) {
        super({}, props);
        registerRerenderer(this.forceUpdate.bind(this));
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    renderThemed(style: {}, theme: ProvidedTheme) {
        const fontSize = Dimensions.get("window").width / 36;

        getListManager();

        const navStyles = applyUnfrozen(navigatorStyles, theme);

        return (
            <Drawer.Navigator
                initialRouteName="Main"
                drawerContent={CustomDrawerContentComponent}
                screenOptions={{
                    drawerActiveBackgroundColor: navStyles.drawer.activeBackgroundColor,
                    drawerInactiveBackgroundColor: navStyles.drawer.inactiveBackgroundColor,
                    drawerActiveTintColor: navStyles.drawer.activeTintColor,
                    drawerInactiveTintColor: navStyles.drawer.inactiveTintColor,

                    drawerStyle: {
                        backgroundColor: navStyles.drawer.backgroundColor,
                        borderStyle: undefined,
                        padding: 0,
                    },
                    drawerItemStyle: {
                        width: "100%",
                        margin: 0,
                        borderRadius: navStyles.drawer.drawerItemBorderRadius,
                    },
                    headerStyle: {
                        backgroundColor: navStyles.header.backgroundColor,
                    },
                    headerTitleStyle: {
                        fontFamily: navStyles.header.fontFamily,
                        letterSpacing: navStyles.header.letterSpacing,
                        fontWeight: navStyles.header.fontWeight,
                        fontStyle: navStyles.header.fontStyle,
                    },
                    headerTintColor: navStyles.header.tintColor,
                    headerTitleAlign: navStyles.header.titleAlign,
                    headerTitle: "Kurabu",
                    drawerLabelStyle: {
                        fontSize: fontSize * 1.2,
                    },
                    headerRight: () => {
                        let currentFunction = getCurrentBackButtonFunc();
                        if (currentFunction === undefined) {
                            return undefined;
                        }

                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    currentFunction = getCurrentBackButtonFunc();
                                    if (currentFunction) currentFunction();
                                }}
                            >
                                <Icon
                                    name="arrow-alt-circle-left"
                                    type="font-awesome-5"
                                    color={navStyles.icon.color}
                                    style={styles.iconStyles}
                                    tvParallaxProperties={{}}
                                />
                            </TouchableOpacity>
                        );
                    },
                }}
            >
                <Drawer.Screen name="Main" component={MainStack} />
                <Drawer.Screen name="Search" component={SearchStack} />
                <Drawer.Screen name="Suggestions" component={SuggestionsStack} />
                <Drawer.Screen name="Ranking" component={RankingStack} />
                <Drawer.Screen name="Seasonal" component={SeasonalStack} />
                <Drawer.Screen name="List" component={ListStack} />
                
            </Drawer.Navigator>
        );
    }
}

const navigatorStyles = {
    drawer: {
        activeBackgroundColor: colors.color("primary"),
        inactiveBackgroundColor: colors.color("surface"),
        activeTintColor: colors.onColor("primary", "paragraph"),
        inactiveTintColor: colors.onColor("surface", "paragraph"),
        backgroundColor: colors.color("background"),
        drawerItemBorderRadius: sizing.rounding<number>("extraSmall")
    },
    header: {
        tintColor: colors.onColor("primary", "header"),
        titleAlign: "center" as "center" | "left",
        fontFamily: typography.fontFamily("headline1"),
        fontWeight: typography.fontWeight("headline1"),
        letterSpacing: typography.letterSpacing("headline1"),
        fontStyle: typography.fontStyle("headline1"),
        backgroundColor: colors.color("primary"),
    },
    icon: {
        color: colors.onColor("primary", "paragraph"),
    }
}

const styles = StyleSheet.create({
    iconStyles: {
        marginRight: 15,
    }
})
