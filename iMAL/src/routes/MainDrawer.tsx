import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStack from "./HomeStack";
import SearchStack from "./SearchStack";
import { Colors } from "../Configuration/Colors";
import Suggestions from "./MainScreens/SuggestionsScreen";
import SuggestionsStack from "./SuggestionsStack";

export const Drawer = createDrawerNavigator();

export default function DrawerComp() {
    return (
        <Drawer.Navigator
            initialRouteName="Main"
            screenOptions={{
                drawerActiveBackgroundColor: Colors.ALTERNATE_BACKGROUND,
                drawerInactiveBackgroundColor: Colors.ALTERNATE_BACKGROUND,
                headerStyle: {
                    backgroundColor: Colors.KURABUPINK,
                },
                headerTitleStyle: {
                    fontFamily: "AGRevueCyr",
                },
                headerTintColor: "white",
                headerTitleAlign: "center",
                title: "Kurabu",
                headerStatusBarHeight: 25,
            }}>
            <Drawer.Screen name="Main" component={MainStack} />
            <Drawer.Screen name="Search" component={SearchStack} />
            <Drawer.Screen name="Suggestions" component={SuggestionsStack} />
        </Drawer.Navigator>
    );
}
