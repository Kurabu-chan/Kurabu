import { MangaSearchSource } from "#api/Manga/MangaSearch";
import { changeActivePage } from "#routes/MainDrawer";
import React from "react";
import { Dimensions } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MediaNodeSource from "../../../APIManager/MediaNodeSource";
import { DetailedUpdateItemFields } from "../../../components/DetailedUpdateItem";
import SearchList from "../../../components/DetailedUpdateList";
import { Colors } from "../../../Configuration/Colors";

type StateType = {
    search: {
        searchText: string;
        query: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    searchSource?: MediaNodeSource;
    animeList?: SearchList;
    listenerToUnMount: any;
};

export default class Search extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            search: {
                searchText: "",
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
        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage("Search");
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

    async DoSearch() {
        if (this.state.search.searchText == "") {
            return;
        }

        const fields = DetailedUpdateItemFields;

        var nodeSource = new MangaSearchSource(
            this.state.search.searchText,
            fields
        );
        this.setState((prevState) => ({
            ...prevState,
            searchSource: nodeSource,
            search: { ...prevState.search, searched: true },
        }));
        if (this.state.animeList) {
            console.log(this.state.search.searchText);
            this.state.animeList.changeSource(
                `Manga search results for: ${this.state.search.searchText}`,
                nodeSource
            );
        }
    }

    createSearchBar() {
        return (
            <SearchBar
                placeholder="Search for a Manga Title.."
                placeholderTextColor={Colors.TEXT}
                searchIconImageStyle={{
                    tintColor: Colors.TEXT,
                }}
                clearIconImageStyle={{
                    tintColor: Colors.TEXT,
                }}
                textInputStyle={{
                    color: Colors.TEXT,
                }}
                style={{
                    backgroundColor: Colors.KURABUPURPLE,
                    marginTop: 5,
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get("window").width - 10,
                }}
                onChangeText={(text) =>
                    this.setState((prevState) => ({
                        ...prevState,
                        search: {
                            ...prevState.search,
                            searchText: text,
                        },
                    }))
                }
                onClearPress={() =>
                    this.setState((prevState) => ({
                        ...prevState,
                        search: {
                            ...prevState.search,
                            searchText: "",
                        },
                    }))
                }
                onSearchPress={this.DoSearch.bind(this)}
                onEndEditing={this.DoSearch.bind(this)}
            />
        );
    }

    onSearchListCreate(list: SearchList) {
        this.setState((prevState) => ({ ...prevState, animeList: list }));
    }

    onSearchListDataGather() {
        this.setState((prevState) => ({
            ...prevState,
            search: { ...prevState.search, found: true },
        }));
    }

    render() {
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
                {this.createSearchBar()}
                {this.state.searchSource !== undefined ? (
                    <SearchList
                        title={`Manga search results for: ${this.state.search.searchText}`}
                        mediaNodeSource={this.state.searchSource}
                        navigator={this.props.navigation}
                        onCreate={this.onSearchListCreate.bind(this)}
                        onDataGather={this.onSearchListDataGather.bind(this)}
                    />
                ) : undefined}
            </SafeAreaProvider>
        );
    }
}
