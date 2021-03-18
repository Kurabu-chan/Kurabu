import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MainStack from './HomeStack';
import SearchStack from './SearchStack';

const RootDrawerNavigator = createDrawerNavigator({
    Main: {
        screen: MainStack
    },
    Search: {
        screen: SearchStack
    }
},
{
    drawerBackgroundColor: "#2E51A2",
    contentOptions: {
        labelStyle: {
            color: "white"
        },
        activeBackgroundColor: "#24417f"
    }
});

export default createAppContainer(RootDrawerNavigator);