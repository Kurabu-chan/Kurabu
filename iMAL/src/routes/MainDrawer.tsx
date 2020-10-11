import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MainStack from './HomeStack';

const RootDrawerNavigator = createDrawerNavigator({
    Main: {
        screen: MainStack
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