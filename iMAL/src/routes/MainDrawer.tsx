import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import MainStack from "./HomeStack";
import SearchStack from "./SearchStack";
import { Colors } from "../Configuration/Colors";
import Suggestions from "./MainScreens/SuggestionsScreen";
import SuggestionsStack from "./SuggestionsStack";

const RootDrawerNavigator = createDrawerNavigator(
    {
        Main: {
            screen: MainStack,
        },
        Search: {
            screen: SearchStack,
        },
        Suggestions: {
            screen: SuggestionsStack,
        },
    },
    {
        drawerBackgroundColor: Colors.ALTERNATE_BACKGROUND,
        contentOptions: {
            labelStyle: {
                color: "white",
            },
            activeBackgroundColor: Colors.KURABUPINK,
        },
    }
);

export default createAppContainer(RootDrawerNavigator);
