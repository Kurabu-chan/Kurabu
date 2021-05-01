import React from "react";
import SearchBar from "react-native-dynamic-search-bar";
import { Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SearchList from "../../components/DetailedUpdateList";
import AnimeNodeSource from "../../APIManager/AnimeNodeSource";
import { Colors } from "../../Configuration/Colors";
import { SearchSource } from "../../APIManager/AnimeSearch";
import { DetailedUpdateItemFields } from "../../components/DetailedUpdateItem";
import { Picker } from "@react-native-community/picker";
import { ItemValue } from "@react-native-community/picker/typings/Picker";
import { RankingSource } from "#api/Ranking";

type StateType = {
    ranking: {
        rankingValue: string;
        query: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    rankingSource?: AnimeNodeSource;
    animeList?: SearchList;
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
        };
    }

    componentDidMount() {
        console.log("mount");
        this.DoRanking();
    }

    async DoRanking() {
        if (this.state.ranking.rankingValue == "") {
            return;
        }

        const fields = DetailedUpdateItemFields;

        var nodeSource = new RankingSource(
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
                `Top ${
                    goodNamingMapping[this.state.ranking.rankingValue]
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
                <Picker.Item key="all" label="All" value="all" />
                <Picker.Item key="airing" label="Airing" value="airing" />
                <Picker.Item key="upcoming" label="Upcoming" value="upcoming" />
                <Picker.Item key="tv" label="Tv" value="tv" />
                <Picker.Item key="ova" label="Ova" value="ova" />
                <Picker.Item key="movie" label="Movie" value="movie" />
                <Picker.Item key="special" label="Special" value="special" />
                <Picker.Item
                    key="bypopularity"
                    label="Popularity"
                    value="bypopularity"
                />
                <Picker.Item key="favorite" label="Favorite" value="favorite" />
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
                {this.createSearchBar()}
                {this.state.rankingSource !== undefined ? (
                    <SearchList
                        title={`Top Overall Rankings`}
                        animeNodeSource={this.state.rankingSource}
                        navigator={this.props.navigation}
                        onCreate={this.onSearchListCreate.bind(this)}
                        onDataGather={this.onSearchListDataGather.bind(this)}
                    />
                ) : undefined}
            </SafeAreaProvider>
        );
    }
}
