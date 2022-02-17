import { changeActivePage } from "#helpers/backButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions } from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimeSearchSource } from "#api/Anime/AnimeSearch";
import MediaNodeSource from "#api/MediaNodeSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";

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

    async DoSearch() {
        console.log(`Searching for ${this.state.search.searchText}`);

        if (this.state.search.searchText == "") {
            return;
        }

        const fields = DetailedUpdateItemFields;

        var nodeSource = new AnimeSearchSource(this.state.search.searchText, fields);
        this.setState((prevState) => ({
            ...prevState,
            searchSource: nodeSource,
            search: {
                ...prevState.search,
                searched: true,
            },
        }));
        if (this.state.animeList) {
            console.log(this.state.search.searchText);
            this.state.animeList.changeSource(
                `Search results for: ${this.state.search.searchText}`,
                nodeSource
            );
        }
    }

    updateSearch(search: string) {
        this.setState((prevState) => ({
            ...prevState,
            search: {
                ...prevState.search,
                searchText: search,
            },
        }));
    }

    createSearchBar() {
        return (
            <SearchBar
                placeholder="Search for an Anime Title.."
                loadingProps={{}}
                showLoading={false}
                lightTheme={false}
                round={true}
                onFocus={() => { }}
                onBlur={() => { }}
                style={{
                    backgroundColor: Colors.KURABUPURPLE,
                    color: Colors.TEXT,
                    width: Dimensions.get("window").width - 10,
                }}
                inputStyle={{
                    color: Colors.TEXT,
                }}
                labelStyle={{
                    backgroundColor: Colors.KURABUPURPLE,
                }}
                searchIcon={{
                    name: "search",
                    color: Colors.TEXT,
                }}
                clearIcon={{
                    name: "close",
                    color: Colors.TEXT
                }}
                inputContainerStyle={{
                    backgroundColor: Colors.KURABUPURPLE,
                }}
                containerStyle={{
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                }}
                leftIconContainerStyle={{
                    backgroundColor: Colors.KURABUPURPLE,
                }}
                onEndEditing={this.DoSearch.bind(this)}
                platform={"default"}
                onChangeText={this.updateSearch.bind(this) as any}
                onClear={() => {
                    this.updateSearch("");
                }}
                onCancel={this.DoSearch.bind(this)}
                value={this.state.search.searchText}
                cancelButtonTitle={"Cancel"}
                cancelButtonProps={{}}
                showCancel={this.state.search.searchText != undefined}
            />
        );
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

    onSearchListCreate(list: SearchList) {
        this.setState((prevState) => ({
            ...prevState,
            animeList: list,
        }));
    }

    onSearchListDataGather() {
        this.setState((prevState) => ({
            ...prevState,
            search: {
                ...prevState.search,
                found: true,
            },
        }));
    }

    render() {
        return (
            <SafeAreaProvider
                style={{
                    backgroundColor: "#1a1a1a",
                }}
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
                    {this.state.searchSource !== undefined ? (
                        <SearchList
                            title={`Search results for: ${this.state.search.searchText}`}
                            mediaNodeSource={this.state.searchSource}
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
