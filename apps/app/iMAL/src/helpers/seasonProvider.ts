import { FlatList } from "react-native-gesture-handler";

export function getCurrentSeason() {
    var date = new Date();
    var month = date.getMonth();
    if (month <= 3) return "winter";
    if (month <= 6) return "spring";
    if (month <= 9) return "summer";
    return "fall";
}