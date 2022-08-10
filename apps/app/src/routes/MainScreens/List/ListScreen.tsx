import { changeActivePage } from "#helpers/backButton";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { AnimeListSource } from "#data/anime/AnimeListSource";
import { FieldSearchBar, FieldValue } from "#comps/FieldSearchBar";
import { StackNavigationProp } from "@react-navigation/stack";
import { ListStackParamList } from "#routes/MainStacks/ListStack";
import { MainGradientBackground } from "#comps/MainGradientBackground";

type Props = {
    navigation: StackNavigationProp<ListStackParamList, "ListScreen">;
}

type StateType = {
    filter: {
        fields: FieldValue[];
        search: string;
        limit?: number;
        offset?: number;
        searched: boolean;
        found: boolean;
    };
    rankingSource?: MediaListSource;
    animeList?: SearchList;
    listenerToUnMount?: () => void;
};

export default class List extends React.Component<Props, StateType> {
    constructor(props: Props) {
        super(props);
        this.state = {
            filter: {
                fields: [
                    {
                        name: "status",
                        negative: false,
                        value: "watching",
                        color: "lime"
                    },
                    {
                        name: "sort",
                        negative: false,
                        value: "status",
                        color: Colors.CYAN
                    }
                ],
                search: "",
                limit: 1000000,
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
        let status: string[] | undefined = [];
        const statusFields = this.state.filter.fields.filter((field) => field.name === "status");
        if (statusFields === undefined || statusFields.length == 0) {
            status = undefined
        } else {
            if (statusFields[0].negative) {
                status = ["completed", "dropped", "on_hold", "plan_to_watch", "watching"];

                const remove = statusFields.map(x => x.value)
                status = status.filter(x => !remove.includes(x.replace(/\s/g, "_")));
            } else {
                status = statusFields.map(x => x.value.replace(/\s/g, "_"))
            }
        }


        const nodeSource = new AnimeListSource(this.state.filter.search, status, "status");
        this.setState((prevState) => ({
            ...prevState,
            rankingSource: nodeSource,
            filter: {
                ...prevState.filter,
                searched: true,
            },
        }));

        this.state.animeList?.changeSource(`Your anime list`, nodeSource);
    }

    // updateSearch(text: string) {
    //     const extracted = extractSearch(text);

    //     this.setState({
    //         ...this.state,
    //         filter: {
    //             ...this.state.filter,
    //             query: text,
    //             search: extracted.search,
    //             status: extracted.status,
    //         }
    //     });

    //     this.doSearch();
    // }

    createSearchBar() {
        return (
            <FieldSearchBar
                fields={[
                    {
                        name: "status",
                        possibleValues: [
                            {
                                val: "watching",
                                color: "lime"
                            },
                            {
                                val: "plan to watch",
                                color: "gray"
                            },
                            {
                                val: "completed",
                                color: "darkblue"
                            },
                            {
                                val: "dropped",
                                color: "red"
                            },
                            {
                                val: "on hold",
                                color: "yellow"
                            }
                        ],
                        subtractable: true
                    },
                    {
                        name: "sort",
                        possibleValues: [
                            {
                                val: "status",
                                color: Colors.CYAN
                            }
                        ],
                        subtractable: true
                    }
                ]}
                onChange={(fields: FieldValue[], text: string, search: boolean) => {
                    this.setState({
                        ...this.state,
                        filter: {
                            ...this.state.filter,
                            search: text,
                            fields: fields,
                        }
                    }, () => {
                        if(search){
                            this.doSearch();
                        }
                    })
                }}
                verify={() => { return true; }}
                search={this.state.filter.search}
                currentFields={this.state.filter.fields}
                onSearch={this.doSearch.bind(this)}
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
                style={styles.safeAreaProvider}
            >
				<MainGradientBackground>
                    {this.createSearchBar()}
                    {this.state.rankingSource !== undefined ? (
                        <SearchList
                            title={`Your anime list`}
                            mediaNodeSource={this.state.rankingSource}
                            navigator={this.props.navigation}
                            onCreate={this.onSearchListCreate.bind(this)}
                            onDataGather={this.onSearchListDataGather.bind(this)}
                            showListStatus={true}
                            limit={10000}
                        />
                    ) : undefined}
                </MainGradientBackground>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
        flex: 1
    }
})
