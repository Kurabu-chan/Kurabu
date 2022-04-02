import { MangaRankingSource } from "#data/manga/MangaRankingSource";
import { changeActivePage } from "#helpers/backButton";
import { Picker } from "@react-native-picker/picker";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { StackScreenProps } from "@react-navigation/stack";
import { RankingStackParamList } from "#routes/MainStacks/RankingStack";

type Props = StackScreenProps<RankingStackParamList, "RankingScreen">

type StateType = {
    ranking: {
        rankingValue: string;
        query: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    rankingSource?: MediaListSource;
    animeList?: SearchList;
    listenerToUnMount?: () => void;
};

export default class Ranking extends React.Component<Props, StateType> {
    constructor(props: Props) {
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

    DoRanking() {
        if (this.state.ranking.rankingValue == "") {
            return;
        }

        const fields = DetailedUpdateItemFields;

        const nodeSource = new MangaRankingSource(fields, this.state.ranking.rankingValue);
        this.setState((prevState) => ({
            ...prevState,
            rankingSource: nodeSource,
            ranking: {
                ...prevState.ranking,
                searched: true,
            },
        }));
        if (this.state.animeList) {
            const goodNamingMapping: {
                [index: string]: string;
            } = {
                all: "Overall",
                manga: "Manga",
                oneshots: "One-shots",
                doujin: "Doujinshi",
                lightnovels: "Light Novels",
                novels: "Novels",
                manhwa: "Manhwa",
                manhua: "Manhua",
                bypopularity: "Popularity",
                favorite: "Favorites",
            };

            console.log(this.state.ranking.rankingValue);
            this.state.animeList.changeSource(
                `Top ${goodNamingMapping[this.state.ranking.rankingValue]} Rankings Manga`,
                nodeSource
            );
        }
    }

    changeRanking(val: ItemValue) {
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
                style={styles.searchBarPicker}
            >
                <Picker.Item key="all" label="All" value="all" />
                <Picker.Item key="manga" label="Manga" value="manga" />
                <Picker.Item key="oneshots" label="One-shots" value="oneshots" />
                <Picker.Item key="doujin" label="Doujinshi" value="doujin" />
                <Picker.Item key="lightnovels" label="Light Novels" value="lightnovels" />
                <Picker.Item key="novels" label="Novels" value="novels" />
                <Picker.Item key="manhwa" label="Manhwa" value="manhwa" />
                <Picker.Item key="manhua" label="Manhua" value="manhua" />
                <Picker.Item key="bypopularity" label="Popularity" value="bypopularity" />
                <Picker.Item key="favorite" label="Favorites" value="favorite" />
            </Picker>
        );
    }

    onSearchListCreate(list: SearchList) {
        this.setState((prevState) => ({
            ...prevState,
            animeList: list,
        }));
    }

    onSearchListDataGather() {
        this.setState((prevState) => ({
            ...prevState,
            ranking: {
                ...prevState.ranking,
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
                        <SearchList
                            title={`Top Overall Rankings`}
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
    searchBarPicker: {
        backgroundColor: Colors.KURABUPURPLE,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        width: Dimensions.get("window").width - 10,
        color: Colors.TEXT,
    },
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
    }
})