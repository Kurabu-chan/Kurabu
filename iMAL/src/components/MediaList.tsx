import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { MediaNode } from "#api/ApiBasicTypes";
import MediaNodeSource from "#api/MediaNodeSource";
import { Colors } from "#config/Colors";
import MediaItem from "./MediaItem";

type MediaListState = {
    title: string;
    data: MediaNode[];
    mediaNodeSource: MediaNodeSource;
    navigator: StackNavigationProp<any, any>;
    offset: number;
};

type MediaListProps = {
    title: string;
    mediaNodeSource: MediaNodeSource;
    navigator: StackNavigationProp<any, any>;
    onCreate?: (media: MediaList) => void;
};

class MediaList extends React.Component<MediaListProps, MediaListState> {
    constructor(props: MediaListProps) {
        super(props);
        this.state = {
            title: props.title,
            data: [],
            mediaNodeSource: props.mediaNodeSource,
            navigator: props.navigator,
            offset: 0,
        };

        if (this.props.onCreate) {
            this.props.onCreate(this);
        }

        this.refresh(this.state.mediaNodeSource);
    }

    public refresh(nodeSource: MediaNodeSource) {
        nodeSource.MakeRequest(20).then((data) => {
            this.setState((prevState) => ({ ...prevState, data: data.data }));
        });
    }

    public loadExtra() {
        this.state.mediaNodeSource
            .MakeRequest(20, this.state.offset + 20)
            .then((data) => {
                this.setState((old) => {
                    old.data.push(...data.data);

                    return {
                        title: old.title,
                        data: old.data,
                        mediaNodeSource: old.mediaNodeSource,
                        navigator: old.navigator,
                        offset: old.data.length,
                    };
                });
            });
    }

    render() {
        return (
            <View style={styles.mediaContainer}>
                <FlatList
                    data={this.state.data}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadExtra.bind(this)}
                    numColumns={2}
                    renderItem={(item) =>
                        item.index > 1 ? (
                            <MediaItem
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
    mediaContainer: {
        // height: 240,
        marginTop: 5,
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        color: Colors.TEXT,
    },
    mediaList: {
        justifyContent: "flex-start",
    },
});

export default MediaList;
