import { AnimeRankingSource } from "#api/Anime/AnimeRanking";
import { changeActivePage } from "#helpers/backButton";
import { Picker } from "@react-native-community/picker";
import { ItemValue } from "@react-native-community/picker/typings/Picker";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MediaNodeSource from "#api/MediaNodeSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";

type StateType = {
    ranking: {
        rankingValue: string;
        query: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    rankingSource?: MediaNodeSource;
    animeList?: SearchList;
    listenerToUnMount: any;
};

export default class Ranking extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            ranking: {
                rankingValue: "all",
                query: "",
                limit: 10,
                offset: 0,
                searched: false,
                found: false,
            },
            listenerToUnMount: undefined,
        };
    }

    componentDidMount() {
        console.log("mount");
        this.DoRanking();

        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage("Ranking");
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

    async DoRanking() {
        if (this.state.ranking.rankingValue == "") {
            return;
        }

        const fields = DetailedUpdateItemFields;

        var nodeSource = new AnimeRankingSource(
            this.state.ranking.rankingValue,
            fields
        );
        this.setState((prevState) => ({
            ...prevState,
            rankingSource: nodeSource,
            ranking: { ...prevState.ranking, searched: true },
        }));
        if (this.state.animeList) {
            var goodNamingMapping: { [index: string]: string } = {
                all: "Overall",
                airing: "Airing anime",
                upcoming: "Upcoming anime",
                tv: "Tv",
                ova: "Ova",
                movie: "Movie",
                special: "Special",
                bypopularity: "Popularity",
                favorite: "Favorites",
            };

            console.log(this.state.ranking.rankingValue);
            this.state.animeList.changeSource(
                `Top ${goodNamingMapping[this.state.ranking.rankingValue]
                } Rankings`,
                nodeSource
            );
        }
    }

    changeRanking(val: ItemValue, index: number) {
        this.setState(
            (prevState) =>
            ({
                ...prevState,
                ranking: {
                    ...prevState.ranking,
                    rankingValue: val.toString(),
                },
            } as StateType),
            this.DoRanking.bind(this)
        );
    }

    createSearchBar() {
        return (
            <Picker
                selectedValue={this.state.ranking.rankingValue}
                onValueChange={this.changeRanking.bind(this)}
                style={{
                    backgroundColor: Colors.KURABUPURPLE,
                    marginTop: 5,
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get("window").width - 10,
                    color: Colors.TEXT,
                }}>
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Airing" value="airing" />
                <Picker.Item label="Upcoming" value="upcoming" />
                <Picker.Item label="Tv" value="tv" />
                <Picker.Item label="Ova" value="ova" />
                <Picker.Item label="Movie" value="movie" />
                <Picker.Item label="Special" value="special" />
                <Picker.Item label="Popularity" value="bypopularity" />
                <Picker.Item label="Favorite" value="favorite" />
            </Picker>
        );
    }

    onSearchListCreate(list: SearchList) {
        this.setState((prevState) => ({ ...prevState, animeList: list }));
    }

    onSearchListDataGather() {
        this.setState((prevState) => ({
            ...prevState,
            ranking: { ...prevState.ranking, found: true },
        }));
    }

    render() {
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
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
                    }}>
                    {this.createSearchBar()}
                    {this.state.rankingSource !== undefined ? (
                        <SearchList
                            title={`Top Overall Rankings`}
                            mediaNodeSource={this.state.rankingSource}
                            navigator={this.props.navigation}
                            onCreate={this.onSearchListCreate.bind(this)}
                            onDataGather={this.onSearchListDataGather.bind(
                                this
                            )}
                        />
                    ) : undefined}
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}
