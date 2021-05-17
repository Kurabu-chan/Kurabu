import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "../Configuration/Colors";
import MainStack from "./MainStacks/HomeStack";
import RankingStack from "./MainStacks/RankingStack";
import SearchStack from "./MainStacks/SearchStack";
import SeasonalStack from "./MainStacks/SeasonalStack";
import SuggestionsStack from "./MainStacks/SuggestionsStack";

export const Drawer = createDrawerNavigator();

type TopRightFuncsType = {
    Main?: () => void;
    Ranking?: () => void;
    Search?: () => void;
    Seasonal?: () => void;
    Suggestions?: () => void;
};

var topRightFuncs: TopRightFuncsType = {
    Main: undefined,
    Ranking: undefined,
    Search: undefined,
    Seasonal: undefined,
    Suggestions: undefined,
};

var page: keyof TopRightFuncsType = "Main";

export function changeActivePage(_page: keyof TopRightFuncsType) {
    page = _page;
    console.log(page);
    rerender();
}

export function changeTopRightButton(
    scr: keyof TopRightFuncsType,
    func?: () => void
) {
    topRightFuncs[scr] = func;
    changeActivePage(scr);
}

export function getActiveScreen() {
    return page;
}

function rerender() {
    rerenderers.forEach((x) => x());
}

var rerenderers: (() => void)[] = [];

export default class DrawerComp extends React.Component {
    constructor(props: any) {
        super(props);
        rerenderers.push(() => {
            this.forceUpdate();
        });
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
                        return topRightFuncs[page] !== undefined ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (topRightFuncs[page])
                                        (topRightFuncs[page] as any)();
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
                        ) : undefined;
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
