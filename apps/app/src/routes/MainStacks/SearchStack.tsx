import Search from "#routes/MainScreens/Search/SearchTabs";
import { createStackWithDetails, ParamListWithDetails } from "./DetailsStack";

type ParamList = {
    SearchScreen: undefined;
};

const stack = createStackWithDetails<ParamList>("SearchScreen", Search);

export default stack; 
export type SearchStackParamList = ParamListWithDetails<ParamList>;