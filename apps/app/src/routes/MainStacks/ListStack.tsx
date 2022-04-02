
import ListTabs from "#routes/MainScreens/List/ListTabs";
import { createStackWithDetails, ParamListWithDetails } from "./DetailsStack";

type ParamList = {
    ListScreen: undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const stack = createStackWithDetails<ParamList>("ListScreen", ListTabs);

export default stack; 
export type ListStackParamList = ParamListWithDetails<ParamList>;