import React from "react";
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator,
} from "react-native";
import DetailedUpdateItem from "./DetailedUpdateItem";
import MediaNodeSource from "../APIManager/MediaNodeSource";
import { Colors } from "../Configuration/Colors";
import { Dimensions } from "react-native";
import { MediaNode } from "../APIManager/ApiBasicTypes";
import { StackNavigationProp } from "@react-navigation/stack";

const BatchSize = 20;

type DetailedUpdateListState = {
    title: string;
    data: MediaNode[];
    mediaNodeSource?: MediaNodeSource;
    navigator: StackNavigationProp<any, any>;
    offset: number;
    needmore: boolean;
    onDataGather?: () => void;
};

type DetailedUpdateListProps = {
    title: string;
    mediaNodeSource: MediaNodeSource;
    navigator: StackNavigationProp<any, any>;
    onCreate?: (media: DetailedUpdateList) => void;
    onDataGather?: () => void;
};

class DetailedUpdateList extends React.Component<
    DetailedUpdateListProps,
    DetailedUpdateListState
> {
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

        this.refresh();
    }

    componentWillUnmount() {
        this.setState({});
    }

    public changeSource(title: string, nodeSource: MediaNodeSource) {
        this.setState(
            (prevState) => ({
                ...prevState,
                title: title,
                mediaNodeSource: nodeSource,
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
        this.state.mediaNodeSource
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
        this.state.mediaNodeSource
            ?.MakeRequest(BatchSize, this.state.offset)
            .then((data) => {
                this.setState((old) => {
                    old.data.push(...data.data);
                    if (data.data.length < BatchSize) {
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
                        onEndReached={this.loadExtra.bind(this)}
                        renderItem={(item) => (
                            <DetailedUpdateItem
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
var fontSize = Dimensions.get("window").width / 36;
const styles = StyleSheet.create({
    mediaContainer: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        marginTop: 10,
        marginRight: 10,
    },
    title: {
        fontSize: fontSize * 1.6,
        textAlign: "center",
        color: Colors.TEXT,
        paddingBottom: 10,
    },
    mediaList: {
        justifyContent: "flex-start",
    },
    loading: {
        marginTop: Dimensions.get("window").height / 2.5,
    },
});

export default DetailedUpdateList;
