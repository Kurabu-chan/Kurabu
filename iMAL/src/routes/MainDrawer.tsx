import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStack from "./MainStacks/HomeStack";
import SearchStack from "./MainStacks/SearchStack";
import { Colors } from "../Configuration/Colors";
import SuggestionsStack from "./MainStacks/SuggestionsStack";
import RankingStack from "./MainStacks/RankingStack";
import React from "react";

export const Drawer = createDrawerNavigator();

export default function DrawerComp() {
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
                headerTintColor: "white",
                headerTitleAlign: "center",
                headerTitle: "Kurabu",
            }}>
            <Drawer.Screen name="Main" component={MainStack} />
            <Drawer.Screen name="Search" component={SearchStack} />
            <Drawer.Screen name="Suggestions" component={SuggestionsStack} />
            <Drawer.Screen name="Ranking" component={RankingStack} />
        </Drawer.Navigator>
    );
}
