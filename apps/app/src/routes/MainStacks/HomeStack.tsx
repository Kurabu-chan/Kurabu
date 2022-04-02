import HomeTabs from "#routes/MainScreens/Home/HomeTabs";
import { createStackWithDetails, ParamListWithDetails } from "./DetailsStack";

type ParamList = {
    HomeScreen: undefined;
};

const stack = createStackWithDetails<ParamList>("HomeScreen", HomeTabs);

export default stack; 
export type HomeStackParamList = ParamListWithDetails<ParamList>;