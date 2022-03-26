import { AnimeSeasonalSource } from "#data/anime/AnimeSeasonalSource";
import { changeActivePage } from "#helpers/backButton";
import { Picker } from "@react-native-community/picker";
import { ItemValue } from "@react-native-community/picker/typings/Picker";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import DetailedUpdateList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { GetSeasonalAnimesSeasonEnum } from "@kurabu/api-sdk";
import { SeasonalStackParamList } from "#routes/MainStacks/SeasonalStack";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<SeasonalStackParamList, "Seasonal">

type StateType = {
    seasonal: {
        seasonValue: GetSeasonalAnimesSeasonEnum;
        yearValue: number;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    rankingSource?: MediaListSource;
    animeList?: DetailedUpdateList;
    listenerToUnMount?: () => void;
};

const currYear = new Date().getFullYear();
const currSeason = getSeason();

export default class Seasonal extends React.Component<Props, StateType> {
    constructor(props: Props) {
        super(props);
        this.state = {
            seasonal: {
                seasonValue: currSeason,
                yearValue: currYear,
                limit: 10,
                offset: 0,
                searched: false,
                found: false,
            },
            listenerToUnMount: undefined,
        };
    }

    componentDidMount() {

        this.DoSeasonal();

        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage("Seasonal");
            // The screen is focused
            // Call any action
        });

        this.setState((prevState) => ({
            ...prevState,
            listenerToUnMount: unsubscribe,
        }));
    }

    componentWillUnmount() {
        if (this.state.listenerToUnMount) this.state.listenerToUnMount();
    }

    DoSeasonal() {
        const fields = DetailedUpdateItemFields;

        const nodeSource = new AnimeSeasonalSource(
            fields,
            this.state.seasonal.yearValue,
            this.state.seasonal.seasonValue,
        );
        this.setState((prevState) => ({
            ...prevState,
            rankingSource: nodeSource,
            seasonal: {
                ...prevState.seasonal,
                searched: true,
            },
        }));
        if (this.state.animeList) {
            console.log(this.state.seasonal.seasonValue);
            this.state.animeList.changeSource(
                `${capitalizeFirstLetter(this.state.seasonal.seasonValue)} ${this.state.seasonal.yearValue
                }`,
                nodeSource
            );
        }
    }

    changeSeason(val: ItemValue) {
        const season = val.toString();
        if (!["winter", "summer", "spring", "fall"].includes(season)) {
            return;
        }

        this.setState(
            (prevState) =>
            ({
                ...prevState,
                seasonal: {
                    ...prevState.seasonal,
                    seasonValue: season,
                },
            } as StateType),
            this.DoSeasonal.bind(this)
        );
    }

    changeYear(val: ItemValue) {
        const year = parseInt(val.toString());
        if (year < 1917 || year > currYear + 1) {
            return;
        }

        this.setState(
            (prevState) =>
            ({
                ...prevState,
                seasonal: {
                    ...prevState.seasonal,
                    yearValue: year,
                },
            } as StateType),
            this.DoSeasonal.bind(this)
        );
    }

    createSearchBar() {
        const allowedSeasons = getAllowedSeasons(maxSeason(this.state.seasonal.yearValue));
        return (
            <View style={styles.searchBarContainer}>
                <Picker
                    selectedValue={this.state.seasonal.seasonValue}
                    onValueChange={this.changeSeason.bind(this)}
                    style={styles.searchBarPicker}
                >
                    <Picker.Item label="Winter" value="winter" />
                    {allowedSeasons.includes("spring") ? (
                        <Picker.Item label="Spring" value="spring" />
                    ) : undefined}
                    {allowedSeasons.includes("summer") ? (
                        <Picker.Item label="Summer" value="summer" />
                    ) : undefined}
                    {allowedSeasons.includes("fall") ? (
                        <Picker.Item label="Fall" value="fall" />
                    ) : undefined}
                </Picker>
                <Picker
                    selectedValue={this.state.seasonal.yearValue.toString()}
                    onValueChange={this.changeYear.bind(this)}
                    style={styles.searchBarPicker}
                >
                    {arrayFromXToY(1917, maxYear(this.state.seasonal.seasonValue) + 1)
                        .reverse()
                        .map((x) => (
                            <Picker.Item
                                key={x.toString()}
                                label={x.toString()}
                                value={x.toString()}
                            />
                        ))}
                </Picker>
            </View>
        );
    }

    onSearchListCreate(list: DetailedUpdateList) {
        this.setState((prevState) => ({
            ...prevState,
            animeList: list,
        }));
    }

    onSearchListDataGather() {
        this.setState((prevState) => ({
            ...prevState,
            seasonal: {
                ...prevState.seasonal,
                found: true,
            },
        }));
    }

    render() {
        return (
            <SafeAreaProvider
                style={styles.safeAreaProvider}
            >
                <LinearGradient
                    // Background Linear Gradient
                    colors={[
                        Colors.KURABUPINK,
                        Colors.KURABUPURPLE,
                        Colors.BACKGROUNDGRADIENT_COLOR1,
                        Colors.BACKGROUNDGRADIENT_COLOR2,
                    ]}
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    }}
                >
                    {this.createSearchBar()}
                    {this.state.rankingSource !== undefined ? (
                        <DetailedUpdateList
                            title={`${capitalizeFirstLetter(this.state.seasonal.seasonValue)} ${this.state.seasonal.yearValue
                                }`}
                            mediaNodeSource={this.state.rankingSource}
                            navigator={this.props.navigation}
                            onCreate={this.onSearchListCreate.bind(this)}
                            onDataGather={this.onSearchListDataGather.bind(this)}
                        />
                    ) : undefined}
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: "row",
    },
    searchBarPicker: {
        backgroundColor: Colors.KURABUPURPLE,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        width: (Dimensions.get("window").width - 20) / 2,
        color: Colors.TEXT,
    },
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND
    }
});


function arrayFromXToY(x: number, y: number) {
    return Array.from(Array(y - x).keys()).map((z) => z + x);
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

type seasons = "winter" | "summer" | "spring" | "fall";
function getSeason(): GetSeasonalAnimesSeasonEnum {
    const month = new Date().getMonth();
    switch (month) {
        case 12:
        case 1:
        case 2:
            return GetSeasonalAnimesSeasonEnum.Winter;
        case 3:
        case 4:
        case 5:
            return GetSeasonalAnimesSeasonEnum.Spring;
        case 6:
        case 7:
        case 8:
            return GetSeasonalAnimesSeasonEnum.Summer;
        case 9:
        case 10:
        case 11:
            return GetSeasonalAnimesSeasonEnum.Fall;
        default:
            return GetSeasonalAnimesSeasonEnum.Fall;
    }
}

function maxYear(season: seasons): number {
    const currSeasonNr = seasonToNr(currSeason);
    if (currSeasonNr > 1) {
        //max year in general is next year. This year is definetly possible in all seasons
        if ((currSeasonNr + 2) % 4 < seasonToNr(season)) return currYear;
        return currYear + 1;
    } else {
        if ((currSeasonNr + 2) % 4 < seasonToNr(season)) return currYear - 1;
        return currYear;
    }
}

function maxSeason(year: number): seasons {
    const currSeasonNr = seasonToNr(currSeason);

    if (year < currYear) return "fall";

    return NrToSeason(currSeasonNr + 2);
}

function getAllowedSeasons(maxSeason: seasons): seasons[] {
    switch (maxSeason) {
        case "winter":
            return ["winter"];
        case "spring":
            return ["winter", "spring"];
        case "summer":
            return ["winter", "spring", "summer"];
        default:
            return ["winter", "spring", "summer", "fall"];
    }
}

function seasonToNr(season: seasons): number {
    switch (season) {
        case "winter":
            return 0;
        case "spring":
            return 1;
        case "summer":
            return 2;
        case "fall":
            return 3;
    }
}

function NrToSeason(nr: number): seasons {
    switch (nr % 4) {
        case 0:
            return "winter";
        case 1:
            return "spring";
        case 2:
            return "summer";
        case 3:
            return "fall";
        default:
            return "winter";
    }
}
