import { changeActivePage } from "#helpers/backButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import { MangaExpandedDetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { SearchBar } from "react-native-elements";
import { MangaListSource } from "#data/manga/MangaListSource";

type StateType = {
    filter: {
        query: string;
        search: string;
        status: undefined | string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    rankingSource?: MediaListSource;
    animeList?: SearchList;
    listenerToUnMount: any;
};
const statusRef = /status:(completed|plan( |_)to( |_)read|dropped|reading|on( |_)hold)/i;


export default class List extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            filter: {
                query: "status:reading",
                search: "",
                status: "reading",
                limit: 100,
                offset: 0,
                searched: false,
                found: false,
            },
            listenerToUnMount: undefined,
        };
    }

    componentDidMount() {
        
        this.doSearch();

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


    doSearch() {
        // start searching
        const fields = MangaExpandedDetailedUpdateItemFields;

        var nodeSource = new MangaListSource();
        this.setState((prevState) => ({
            ...prevState,
            rankingSource: nodeSource,
            filter: {
                ...prevState.filter,
                searched: true,
            },
        }));
    }

    updateSearch(text: string) {
        const extracted = extractSearch(text);

        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                query: text,
                search: extracted.search,
                status: extracted.status,
            }
        });

        this.doSearch();
    }

    createSearchBar() {
        return (
            <SearchBar
                placeholder="Search for an Manga Title.."
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
                onEndEditing={this.doSearch.bind(this)}
                platform={"default"}
                onChangeText={this.updateSearch.bind(this) as any}
                onClear={() => {
                    this.updateSearch("");
                }}
                onCancel={this.doSearch.bind(this)}
                value={this.state.filter?.query ?? ""}
                cancelButtonTitle={"Cancel"}
                cancelButtonProps={{}}
                showCancel={this.state.filter?.query != undefined}
            />
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
            filter: {
                ...prevState.filter,
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
                    {this.state.rankingSource !== undefined ? (
                        <SearchList
                            title={`Your manga list`}
                            mediaNodeSource={this.state.rankingSource}
                            navigator={this.props.navigation}
                            onCreate={this.onSearchListCreate.bind(this)}
                            onDataGather={this.onSearchListDataGather.bind(this)}
                            showListStatus={true}
                        />
                    ) : undefined}
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}

function extractSearch(query: string) {
    const matches = query.match(statusRef);

    if (matches === null) {
        return {
            search: query.trim(),
            status: undefined
        }
    }

    const statusMatch = matches[0].toLowerCase();
    const status = statusMatch.split(":")[1];

    const formatted_status = status.replace(/ /g, "_").toLowerCase();
    return {
        search: query.replace(statusRef, "").trim(),
        status: formatted_status
    }
}