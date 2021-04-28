import { createStackNavigator } from "@react-navigation/stack";
import Search from "./MainScreens/SearchScreen";
import AnimeDetails from "./MainScreens/AnimeDetails";
import { Colors } from "../Configuration/Colors";
import { AnimeNode } from "../APIManager/ApiBasicTypes";

export type SearchStackParamList = {
    Search: undefined;
    Details: {
        item: AnimeNode;
    };
};

const Stack = createStackNavigator();
export default function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: "screen",
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
            }}
            initialRouteName="Search">
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Details" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
