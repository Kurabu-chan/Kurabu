import { changeActivePage } from "#helpers/backButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimeSearchSource } from "#data/anime/AnimeSearchSource";
import { MediaListSource } from "#data/MediaListSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { StackScreenProps } from "@react-navigation/stack";
import { SearchStackParamList } from "#routes/MainStacks/SearchStack";

type Props = StackScreenProps<SearchStackParamList, "Search">;

type StateType = {
    search: {
        searchText: string;
        query: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    searchSource?: MediaListSource;
    animeList?: SearchList;
    listenerToUnMount?: () => void;
};

export default class Search extends React.Component<Props, StateType> {
    constructor(props: Props) {
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

    DoSearch() {
        console.log(`Searching for ${this.state.search.searchText}`);

        if (this.state.search.searchText == "") {
            return;
        }

        const fields = DetailedUpdateItemFields;

        const nodeSource = new AnimeSearchSource(this.state.search.searchText, fields);
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
                onFocus={() => {
                    return;
                }}
                onBlur={() => {
                    return;
                }}
                style={styles.style}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                searchIcon={{
                    name: "search",
                    color: Colors.TEXT,
                }}
                clearIcon={{
                    name: "close",
                    color: Colors.TEXT
                }}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={styles.containerStyle}
                leftIconContainerStyle={styles.leftIconContainerStyle}
                onEndEditing={this.DoSearch.bind(this)}
                platform={"default"}
                onChangeText={this.updateSearch.bind(this) as never}
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

const styles = StyleSheet.create({
    style: {
        backgroundColor: Colors.KURABUPURPLE,
        color: Colors.TEXT,
        width: Dimensions.get("window").width - 10
    },
    inputStyle: {
        color: Colors.TEXT,
    },
    labelStyle: {
        backgroundColor: Colors.KURABUPURPLE,
    },
    inputContainerStyle: {
        backgroundColor: Colors.KURABUPURPLE,
    },
    containerStyle: {
        backgroundColor: Colors.TRANSPARENT,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    leftIconContainerStyle: {
        backgroundColor: Colors.KURABUPURPLE,
    },
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND
    }
});
