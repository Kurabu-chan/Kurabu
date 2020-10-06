import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MainStack from './HomeStack';

const RootDrawerNavigator = createDrawerNavigator({
    Main: {
        screen: MainStack
    }
});

export default createAppContainer(RootDrawerNavigator);