import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MainStack from './HomeStack';
import SearchStack from './SearchStack';
import { Colors } from '../Configuration/Colors';

const RootDrawerNavigator = createDrawerNavigator({
    Main: {
        screen: MainStack
    },
    Search: {
        screen: SearchStack
    }
},
{
    drawerBackgroundColor: Colors.ALTERNATE_BACKGROUND,
    contentOptions: {
        labelStyle: {
            color: "white",
        },
        activeBackgroundColor: Colors.KURABUPINK,
    }
});

export default createAppContainer(RootDrawerNavigator);