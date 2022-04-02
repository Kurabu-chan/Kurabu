import Seasonal from "#routes/MainScreens/SeasonalScreen";
import { createStackWithDetails, ParamListWithDetails } from "./DetailsStack";

type ParamList = {
    SeasonalScreen: undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const stack = createStackWithDetails<ParamList>("SeasonalScreen", Seasonal);

export default stack; 
export type SeasonalStackParamList = ParamListWithDetails<ParamList>;