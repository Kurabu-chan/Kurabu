import React from "react";
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator,
} from "react-native";
import SearchItem from "./SearchItem";
import AnimeNodeSource from "../APIManager/AnimeNodeSource";
import { Colors } from "../Configuration/Colors";
import { Dimensions } from "react-native";
import { AnimeNode } from "../APIManager/ApiBasicTypes";
import { StackNavigationProp } from "@react-navigation/stack";

const BatchSize = 20;

type AnimeListState = {
    title: string;
    data: AnimeNode[];
    animeNodeSource?: AnimeNodeSource;
    navigator: StackNavigationProp<any, any>;
    offset: number;
    needmore: boolean;
    onDataGather?: () => void;
};

type AnimeListProps = {
    title: string;
    animeNodeSource: AnimeNodeSource;
    navigator: StackNavigationProp<any, any>;
    onCreate?: (anime: AnimeList) => void;
    onDataGather?: () => void;
};

class AnimeList extends React.Component<AnimeListProps, AnimeListState> {
    constructor(props: AnimeListProps) {
        super(props);
        this.state = {
            title: props.title,
            data: [],
            animeNodeSource: props.animeNodeSource,
            navigator: props.navigator,
            offset: 0,
            onDataGather: props.onDataGather,
            needmore: true,
        };

        if (this.props.onCreate) {
            this.props.onCreate(this);
        }

        this.refresh();
    }

    componentWillUnmount() {
        this.setState({});
    }

    public changeSearch(title: string, nodeSource: AnimeNodeSource) {
        this.setState(
            (prevState) => ({
                ...prevState,
                title: title,
                animeNodeSource: nodeSource,
                offset: 0,
                data: [],
            }),
            () => {
                this.refresh();
            }
        );
    }

    public refresh() {
        if (this.state.onDataGather != undefined) {
            this.state.onDataGather();
        }
        this.state.animeNodeSource
            ?.MakeRequest(BatchSize, this.state.offset)
            .then((data) => {
                this.setState((prevState) => ({
                    ...prevState,
                    data: data.data,
                    offset: data.data.length,
                }));
            });
    }

    public loadExtra() {
        this.state.animeNodeSource
            ?.MakeRequest(BatchSize, this.state.offset)
            .then((data) => {
                this.setState((old) => {
                    old.data.push(...data.data);
                    if (data.data.length < BatchSize) {
                        return {
                            title: old.title,
                            data: old.data,
                            animeNodeSource: old.animeNodeSource,
                            navigator: old.navigator,
                            offset: old.data.length,
                            needmore: false,
                        };
                    }

                    return {
                        title: old.title,
                        data: old.data,
                        animeNodeSource: old.animeNodeSource,
                        navigator: old.navigator,
                        offset: old.data.length,
                        needmore: true,
                    };
                });
            });
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <View style={styles.animeContainer}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <FlatList
                        horizontal={false}
                        data={this.state.data}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.loadExtra.bind(this)}
                        renderItem={(item) => (
                            <SearchItem
                                item={item.item}
                                navigator={this.state.navigator}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        } else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color={Colors.KURABUPINK}
                />
            );
        }
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        marginTop: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        color: Colors.TEXT,
    },
    animeList: {
        justifyContent: "flex-start",
    },
    loading: {
        marginTop: Dimensions.get("window").height / 2.5,
    },
});

export default AnimeList;
