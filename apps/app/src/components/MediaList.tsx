import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import MediaItem from "./MediaItem";
import { MediaListSource } from "#data/MediaListSource";
import { AnimeListData, MangaListData, MediaFields } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/native";
import { AppliedStyles, sizing, ThemedComponent } from "@kurabu/theme";
import { Typography } from "./themed/Typography";

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

class MediaList extends ThemedComponent<Styles, MediaListProps, MediaListState> {
    constructor(props: MediaListProps) {
        super(styles, props);

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

    renderThemed(styles: AppliedStyles<Styles>) {
        return (
            <View style={styles.mediaContainer}>
                <FlatList
                    data={this.state.data}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        void this.loadExtra();
                    }}
                    numColumns={2}
                    renderItem={(item) =>
                        item.index > 1 ? (
                            <MediaItem item={item.item} navigator={this.state.navigator} />
						) : item.index == 0 ? (
								<Typography colorVariant="background" isOnContainer={false} textKind="header" variant="headline3" style={styles.title}>{this.state.title}</Typography>
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

type Styles = typeof styles;
const styles = StyleSheet.create({
    mediaContainer: {
        // height: 240,
		marginTop: sizing.spacing("halfMedium"),
    },
    title: {
        marginLeft: sizing.spacing("medium"),
    }
});

export default MediaList;
