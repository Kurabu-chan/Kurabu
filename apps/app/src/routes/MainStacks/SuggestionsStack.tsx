import Suggestions from "#routes/MainScreens/SuggestionsScreen";
import { createStackWithDetails, ParamListWithDetails } from "./DetailsStack";

type ParamList = {
    SuggestionsScreen: undefined;
};

const stack = createStackWithDetails<ParamList>("SuggestionsScreen", Suggestions);

export default stack; 
export type SuggestionsStackParamList = ParamListWithDetails<ParamList>;