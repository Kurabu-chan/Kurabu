import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import DetailedUpdateItem from "./DetailedUpdateItem";
import { MediaListSource } from "#data/MediaListSource";
import { AnimeListData, MangaListData } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/native";
import { AppliedStyles, colors, sizing, ThemedComponent, resolve, ProvidedTheme } from "@kurabu/theme";
import { Typography } from "./themed/Typography";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";

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

class DetailedUpdateList extends ThemedComponent<Styles, DetailedUpdateListProps, DetailedUpdateListState> {
    constructor(props: DetailedUpdateListProps) {
        super(styles, props);
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

    renderThemed(styles: AppliedStyles<Styles>, theme: ProvidedTheme) {
        if (this.state.data.length > 0) {
            return (
                <View style={styles.mediaContainer}>
                    <Typography style={styles.title} colorVariant="primary" isOnContainer={false} textKind="header" variant="headline3">
                        {this.state.title}
                    </Typography>
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                <ActivityIndicator style={styles.loading} size="large" color={resolve(colors.color("primary"), theme)} />
            );
        }
    }
}

type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
    mediaContainer: {
        height: sizing.vh(100),
        width: sizing.vw(100),
        marginTop: sizing.spacing("medium"),
        marginRight: sizing.spacing("medium"),
        flex: 1
    },
    title: {
        textAlign: "center",
        paddingBottom: sizing.spacing("medium"),
    },
    loading: {
        marginTop: sizing.vh(40),
    },
});

export default DetailedUpdateList;
