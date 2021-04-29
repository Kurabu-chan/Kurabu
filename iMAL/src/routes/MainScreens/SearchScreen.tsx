import React from "react";
import SearchBar from "react-native-dynamic-search-bar";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SearchList from "../../components/SearchList";
import AnimeNodeSource from "../../APIManager/AnimeNodeSource";
import { Colors } from "../../Configuration/Colors";
import { SearchSource } from "../../APIManager/AnimeSearch";
import { SearchItemFields } from "../../components/SearchItem";

type StateType = {
    search: {
        searchText: string;
        query: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    searchSource?: AnimeNodeSource;
    animeList?: SearchList;
};

export default class Home extends React.Component<any, StateType> {
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
        };
    }

    async DoSearch() {
        if (this.state.search.searchText == "") {
            return;
        }

        const fields = SearchItemFields;

        var nodeSource = new SearchSource(this.state.search.searchText, fields);
        this.setState({
            ...this.state,
            searchSource: nodeSource,
            search: { ...this.state.search, searched: true },
        });
        if (this.state.animeList) {
            console.log(this.state.search.searchText);
            this.state.animeList.changeSearch(
                `Search results for: ${this.state.search.searchText}`,
                nodeSource
            );
        }
    }

    createSearchBar() {
        return (
            <SearchBar
                placeholder="Search for an Anime Title.."
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
                    this.setState({
                        ...this.state,
                        search: {
                            ...this.state.search,
                            searchText: text,
                        },
                    })
                }
                onClearPress={() =>
                    this.setState({
                        ...this.state,
                        search: {
                            ...this.state.search,
                            searchText: "",
                        },
                    })
                }
                onSearchPress={this.DoSearch.bind(this)}
                onEndEditing={this.DoSearch.bind(this)}
            />
        );
    }

    onSearchListCreate(list: SearchList) {
        this.setState({ ...this.state, animeList: list });
    }

    onSearchListDataGather() {
        this.setState({
            ...this.state,
            search: { ...this.state.search, found: true },
        });
    }

    render() {
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
                {this.createSearchBar()}
                {this.state.searchSource !== undefined ? (
                    <SearchList
                        title={`Search results for: ${this.state.search.searchText}`}
                        animeNodeSource={this.state.searchSource}
                        navigator={this.props.navigation}
                        onCreate={this.onSearchListCreate.bind(this)}
                        onDataGather={this.onSearchListDataGather.bind(this)}
                    />
                ) : undefined}
            </SafeAreaProvider>
        );
    }
}

const pageStyles = StyleSheet.create({
    loading: {
        marginTop: Dimensions.get("window").height / 2.5,
    },
});
