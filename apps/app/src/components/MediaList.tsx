import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "#config/Colors";
import MediaItem from "./MediaItem";
import { MediaListSource } from "#data/MediaListSource";
import { AnimeListData, MangaListData, MediaFields } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/native";

type MediaListState = {
    title: string;
    data: (AnimeListData | MangaListData)[];
    mediaNodeSource: MediaListSource;
    navigator: StackNavigationProp<ParamListBase, string>;
    offset: number;
};

type MediaListProps = {
    title: string;
    mediaNodeSource: MediaListSource;
    navigator: StackNavigationProp<ParamListBase, string>;
    onCreate?: (media: MediaList) => void;
};

export const mediaListFields: MediaFields[] = [
    MediaFields.Title,
    MediaFields.MainPicture,
    MediaFields.MediaType
];

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

        void this.refresh(this.state.mediaNodeSource);
    }

    public async refresh(nodeSource: MediaListSource) {
        const data = await nodeSource.MakeRequest(20);

        this.setState((prevState) => ({
            ...prevState,
            data: data.data,
        }));
    }

    public async loadExtra() {
        const data = await this.state.mediaNodeSource.MakeRequest(20, this.state.offset + 20);

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
                            <MediaItem item={item.item} navigator={this.state.navigator} />
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
    }
});

export default MediaList;
