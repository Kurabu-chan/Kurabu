import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "#config/Colors";
import { getCurrentBackButtonFunc, registerRerenderer } from "#helpers/backButton";
import MainStack from "./MainStacks/HomeStack";
import RankingStack from "./MainStacks/RankingStack";
import SearchStack from "./MainStacks/SearchStack";
import SeasonalStack from "./MainStacks/SeasonalStack";
import SuggestionsStack from "./MainStacks/SuggestionsStack";

export const Drawer = createDrawerNavigator();

export default class DrawerComp extends React.Component {
    constructor(props: any) {
        super(props);
        registerRerenderer(this.forceUpdate.bind(this));
    }

    render() {
        var fontSize = Dimensions.get("window").width / 36;
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
                                    if (currentFunction)
                                        (currentFunction)();
                                }}>
                                <Icon
                                    name="arrow-alt-circle-left"
                                    type="font-awesome-5"
                                    color={Colors.TEXT}
                                    style={{
                                        marginRight: 15,
                                    }}
                                />
                            </TouchableOpacity>
                        );
                    },
                }}>
                <Drawer.Screen name="Main" component={MainStack} />
                <Drawer.Screen name="Search" component={SearchStack} />
                <Drawer.Screen
                    name="Suggestions"
                    component={SuggestionsStack}
                />
                <Drawer.Screen name="Ranking" component={RankingStack} />
                <Drawer.Screen name="Seasonal" component={SeasonalStack} />
            </Drawer.Navigator>
        );
    }
}
