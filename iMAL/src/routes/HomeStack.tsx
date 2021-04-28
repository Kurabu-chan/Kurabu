import { createStackNavigator } from "@react-navigation/stack";
import Main from "./MainScreens/HomeScreen";
import AnimeDetails from "./MainScreens/AnimeDetails";
import { Colors } from "../Configuration/Colors";
import { AnimeNode } from "../APIManager/ApiBasicTypes";

const Stack = createStackNavigator();
export type HomeStackParamList = {
    Home: undefined;
    Details: {
        item: AnimeNode;
    };
};

export default function HomeStack() {
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
            initialRouteName="Home">
            <Stack.Screen name="Home" component={Main} />
            <Stack.Screen name="Details" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
