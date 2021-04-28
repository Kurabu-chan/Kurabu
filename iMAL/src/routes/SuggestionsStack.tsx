import Suggestions from "./MainScreens/SuggestionsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AnimeDetails from "./MainScreens/AnimeDetails";
import { Colors } from "../Configuration/Colors";

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
            initialRouteName="Suggestions">
            <Stack.Screen name="Suggestions" component={Suggestions} />
            <Stack.Screen name="Details" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
