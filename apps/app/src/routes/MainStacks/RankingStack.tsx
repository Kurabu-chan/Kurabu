import Ranking from "#routes/MainScreens/Ranking/RankingTabs";
import { createStackWithDetails, ParamListWithDetails } from "./DetailsStack";

type ParamList = {
    RankingScreen: undefined;
};

const stack = createStackWithDetails<ParamList>("RankingScreen", Ranking);

export default stack; 
export type RankingStackParamList = ParamListWithDetails<ParamList>;