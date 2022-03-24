import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "#config/Colors";
import { getCurrentBackButtonFunc, registerRerenderer } from "#helpers/backButton";
import MainStack from "./MainStacks/HomeStack";
import RankingStack from "./MainStacks/RankingStack";
import SearchStack from "./MainStacks/SearchStack";
import SeasonalStack from "./MainStacks/SeasonalStack";
import SuggestionsStack from "./MainStacks/SuggestionsStack";
import ListStack from "./MainStacks/ListStack";
import { getListManager } from "#helpers/ListManager";

export const Drawer = createDrawerNavigator();

type Props = unknown;

export default class DrawerComp extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        registerRerenderer(this.forceUpdate.bind(this));
    }

    render() {
        const fontSize = Dimensions.get("window").width / 36;

        getListManager();

        return (
            <Drawer.Navigator
                initialRouteName="Main"
                screenOptions={{
                    drawerActiveBackgroundColor: Colors.KURABUPINK,
                    drawerInactiveBackgroundColor: Colors.ALTERNATE_BACKGROUND,
                    drawerActiveTintColor: "white",
                    drawerInactiveTintColor: "white",

                    drawerStyle: {
                        backgroundColor: Colors.ALTERNATE_BACKGROUND,
                        borderStyle: undefined,
                        padding: 0,
                    },
                    drawerItemStyle: {
                        width: "100%",
                        margin: 0,
                        borderRadius: 2,
                    },
                    headerStyle: {
                        backgroundColor: Colors.KURABUPINK,
                    },
                    headerTitleStyle: {
                        fontFamily: "AGRevueCyr",
                    },
                    headerTintColor: Colors.TEXT,
                    headerTitleAlign: "center",
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
                                    color={Colors.TEXT}
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

const styles = StyleSheet.create({
    iconStyles: {
        marginRight: 15,
    }
})