import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "#config/Colors";
import DetailedUpdateItem from "./DetailedUpdateItem";
import { MediaListSource } from "#data/MediaListSource";
import { AnimeListData, MangaListData } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/native";

const BatchSize = 20;

type DetailedUpdateListState = {
    title: string;
    data: (AnimeListData | MangaListData)[];
    mediaNodeSource?: MediaListSource;
    navigator: StackNavigationProp<ParamListBase, string>;
    offset: number;
    needmore: boolean;
    onDataGather?: () => void;
};

type DetailedUpdateListProps = {
    title: string;
    mediaNodeSource: MediaListSource;
    navigator: StackNavigationProp<ParamListBase, string>;
    onCreate?: (media: DetailedUpdateList) => void;
    onDataGather?: () => void;
    showListStatus?: boolean;
    limit?: number;
};

class DetailedUpdateList extends React.Component<DetailedUpdateListProps, DetailedUpdateListState> {
    constructor(props: DetailedUpdateListProps) {
        super(props);
        this.state = {
            title: props.title,
            data: [],
            mediaNodeSource: props.mediaNodeSource,
            navigator: props.navigator,
            offset: 0,
            onDataGather: props.onDataGather,
            needmore: true,
        };

        if (this.props.onCreate) {
            this.props.onCreate(this);
        }

        void this.refresh();
    }

    componentWillUnmount() {
        this.setState({});
    }

    public  changeSource(title: string, nodeSource: MediaListSource) {
        this.setState(
            (prevState) => ({
                ...prevState,
                title: title,
                mediaNodeSource: nodeSource,
                offset: 0,
                data: [],
            }),
            () => {
                void this.refresh();
            }
        );
    }

    public async refresh() {
        if (this.state.onDataGather != undefined) {
            this.state.onDataGather();
        }

        if (this.state.mediaNodeSource == undefined) return;
        const data = await this.state.mediaNodeSource.MakeRequest(this.props.limit ?? BatchSize, this.state.offset);

        this.setState((prevState) => ({
            ...prevState,
            data: data.data,
            offset: data.data.length,
        }));
    }

    public async loadExtra() {
        if (this.state.mediaNodeSource == undefined) return;

        const data = await this.state.mediaNodeSource?.MakeRequest(this.props.limit ?? BatchSize, this.state.offset)
        this.setState((old) => {
            old.data.push(...data.data);
            if (data.data.length < (this.props.limit ?? BatchSize)) {
                return {
                    title: old.title,
                    data: old.data,
                    mediaNodeSource: old.mediaNodeSource,
                    navigator: old.navigator,
                    offset: old.data.length,
                    needmore: false,
                };
            }

            return {
                title: old.title,
                data: old.data,
                mediaNodeSource: old.mediaNodeSource,
                navigator: old.navigator,
                offset: old.data.length,
                needmore: true,
            };
        });
        
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <View style={styles.mediaContainer}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <FlatList
                        horizontal={false}
                        data={this.state.data}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            void this.loadExtra();
                        }}
                        renderItem={(item) => (
                            <DetailedUpdateItem
                                item={item.item} navigator={this.state.navigator}
                                showListStatus={this.props.showListStatus}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        } else {
            return (
                <ActivityIndicator style={styles.loading} size="large" color={Colors.KURABUPINK} />
            );
        }
    }
}
const fontSize = Dimensions.get("window").width / 36;
const styles = StyleSheet.create({
    mediaContainer: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        marginTop: 10,
        marginRight: 10,
        flex: 1
    },
    title: {
        fontSize: fontSize * 1.6,
        textAlign: "center",
        color: Colors.TEXT,
        paddingBottom: 10,
    },
    loading: {
        marginTop: Dimensions.get("window").height / 2.5,
    },
});

export default DetailedUpdateList;
