import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import AnimeItem from "./AnimeItem";
import AnimeNodeSource from "../APIManager/AnimeNodeSource";
import { Colors } from "../Configuration/Colors";
import { AnimeNode } from "../APIManager/ApiBasicTypes";
import { StackNavigationProp } from "@react-navigation/stack";

type AnimeListState = {
    title: string;
    data: AnimeNode[];
    animeNodeSource: AnimeNodeSource;
    navigator: StackNavigationProp<any, any>;
    offset: number;
};

type AnimeListProps = {
    title: string;
    animeNodeSource: AnimeNodeSource;
    navigator: StackNavigationProp<any, any>;
    onCreate?: (anime: AnimeList) => void;
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
        };

        if (this.props.onCreate) {
            this.props.onCreate(this);
        }

        this.refresh(this.state.animeNodeSource);
    }

    public refresh(nodeSource: AnimeNodeSource) {
        nodeSource.MakeRequest(20).then((data) => {
            this.setState({ ...this.state, data: data.data });
        });
    }

    public loadExtra() {
        this.state.animeNodeSource
            .MakeRequest(20, this.state.offset + 20)
            .then((data) => {
                this.setState((old) => {
                    old.data.push(...data.data);

                    return {
                        title: old.title,
                        data: old.data,
                        animeNodeSource: old.animeNodeSource,
                        navigator: old.navigator,
                        offset: old.data.length,
                    };
                });
            });
    }

    render() {
        return (
            <View style={styles.animeContainer}>
                <FlatList
                    data={this.state.data}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadExtra.bind(this)}
                    numColumns={2}
                    renderItem={(item) =>
                        item.index > 1 ? (
                            <AnimeItem
                                item={item.item}
                                navigator={this.state.navigator}
                            />
                        ) : item.index == 0 ? (
                            <Text style={styles.title}>{this.state.title}</Text>
                        ) : (
                            <View></View>
                        )
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        // height: 240,
        marginTop: 5,
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        color: Colors.TEXT,
    },
    animeList: {
        justifyContent: "flex-start",
    },
});

export default AnimeList;
