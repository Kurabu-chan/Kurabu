import React from "react";
import { MangaDetailsSource } from "#data/manga/MangaDetailsSource";
import { BackButtonFunctionsType, changeActivePage, changeBackButton, getActivePage } from "#helpers/backButton";
import { LinearGradient } from "expo-linear-gradient";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { AnimeDetailsSource } from "#data/anime/AnimeDetailsSource";
import { Divider } from "#comps/Divider";
import { LargeText } from "#comps/LargeText";
import MediaItem from "#comps/MediaItem";
import { Colors } from "#config/Colors";
import { HomeStackParamList } from "../MainStacks/HomeStack";
import { ListStatus } from "#comps/ListStatus";
import { AnimeDetails, AnimeDetailsMediaTypeEnum, AnimeListData, MangaDetails, MangaDetailsMediaTypeEnum, MangaListData } from "@kurabu/api-sdk";
import { niceDateFormat } from "#helpers/textFormatting";

type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "DetailsScreen">;
    route: RouteProp<HomeStackParamList, "DetailsScreen">;
};

type State = {
    mediaId?: number;
    media?: AnimeDetails | MangaDetails;
    listenerToUnMount?: () => void;
    page: keyof BackButtonFunctionsType;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

const sizer = Dimensions.get("window").width / 400;

export default class Details extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        let mediaId = props.route.params.id;
        const mediaType = props.route.params.mediaType;
        if (mediaId == undefined) {
            mediaId = 1;
        }
        console.log(`Showing details for: ${mediaType} ${mediaId}`);
        this.state = {
            mediaId: mediaId,
            listenerToUnMount: undefined,
            page: getActivePage(),
            mediaType: mediaType,
        };

        void this.refresh();
    }

    async refresh() {
        if (this.state.mediaId === undefined) return;

        const mangaMediaTypes: (AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum)[] = [
            MangaDetailsMediaTypeEnum.Manga,
            MangaDetailsMediaTypeEnum.Doujinshi,
            MangaDetailsMediaTypeEnum.Manhwa,
            MangaDetailsMediaTypeEnum.Manhua,
            MangaDetailsMediaTypeEnum.Oel,
            MangaDetailsMediaTypeEnum.OneShot,
            MangaDetailsMediaTypeEnum.Novel,
            MangaDetailsMediaTypeEnum.OneShot
        ];

        let detailsSource: MangaDetailsSource | AnimeDetailsSource;
        if (mangaMediaTypes.includes(this.state.mediaType)) {
            detailsSource = new MangaDetailsSource(this.state.mediaId, []);
        } else {
            detailsSource = new AnimeDetailsSource(this.state.mediaId, []);
        }

        const details = await detailsSource.MakeRequest();

        this.setState({
            mediaId: this.state.mediaId,
            media: details,
        })


    }

    componentDidMount() {
        changeBackButton(this.state.page, () => {
            this.props.navigation.popToTop();
            changeBackButton(this.state.page, undefined);
        });

        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage(this.state.page);
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

    niceString(text: string | undefined) {
        if (text == undefined) return "";
        text = text.replace("_", " ");
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    episodesLabel() {
        if (this.state.media === undefined) {
            return undefined;
        }

        if ("numEpisodes" in this.state.media) {
            return (<View>
                <Text style={styles.TopAreaLabel}>Episodes:</Text>
            </View>);
        }

        return (<View>
            <Text style={styles.TopAreaLabel}>Chapters:</Text>
            <Text style={styles.TopAreaLabel}>Volumes:</Text>
        </View>);
    }

    episodesValue() {
        if (this.state.media === undefined) {
            return undefined;
        }

        if ("numEpisodes" in this.state.media) {
            const media: AnimeDetails = this.state.media;

            return (<View>
                <Text style={styles.TopAreaLabel}>{valueOrND(media.numEpisodes)}</Text>
            </View>);
        }

        const media: MangaDetails = this.state.media as MangaDetails;

        return (<View>
            <Text style={styles.TopAreaLabel}>{valueOrND(media.numChapters)}</Text>
            <Text style={styles.TopAreaLabel}>{valueOrND(media.numVolumes)}</Text>
        </View>);
    }

    render() {
        return (
            <SafeAreaView style={styles.appContainer}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={[
                        Colors.KURABUPINK,
                        Colors.KURABUPURPLE,
                        Colors.BACKGROUNDGRADIENT_COLOR1,
                        Colors.BACKGROUNDGRADIENT_COLOR2_DETAILS,
                    ]}
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    }}
                >
                    {this.state.media == undefined ? (
                        <ActivityIndicator
                            style={styles.loading}
                            size="large"
                            color={Colors.BLUE}
                        />
                    ) : (
                        <ScrollView style={styles.page}>
                            <View style={styles.TopArea}>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: this.state.media?.mainPicture?.large,
                                    }}
                                />
                                <View style={styles.TitleArea}>
                                    <Text style={styles.title}>{this.state.media.title}</Text>
                                    {this.state.media.title !=
                                        this.state.media.alternativeTitles?.en ? (
                                        <Text style={styles.alternateTitle}>
                                            {this.state.media.alternativeTitles?.en}
                                        </Text>
                                    ) : undefined}
                                    <Text style={styles.alternateTitle}>
                                        {this.state.media.alternativeTitles?.ja}
                                    </Text>
                                    <Divider color={Colors.DIVIDER} widthPercentage={100} />
                                    <View style={styles.TopAreaData}>
                                        <View style={styles.TopAreaLabels}>
                                            <Text style={styles.TopAreaLabel}>Score:</Text>
                                            <Text style={styles.TopAreaLabel}>Rank:</Text>
                                            <Text style={styles.TopAreaLabel}>Popularity:</Text>
                                        </View>
                                        <View style={styles.TopAreaValues}>
                                            <Text style={styles.TopAreaValue}>
                                                {this.state.media.mean}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                #{this.state.media.rank}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                #{this.state.media.popularity}
                                            </Text>
                                        </View>
                                    </View>
                                    <Divider color={Colors.DIVIDER} widthPercentage={100} />
                                    <View style={styles.TopAreaData}>
                                        <View style={styles.TopAreaLabels}>
                                            <Text style={styles.TopAreaLabel}>Status:</Text>
                                            <Text style={styles.TopAreaLabel}>Aired:</Text>
                                            {this.episodesLabel()}
                                            <Text style={styles.TopAreaLabel}>Genres:</Text>
                                        </View>
                                        <View style={styles.TopAreaValues}>
                                            <Text style={styles.TopAreaValue}>
                                                {this.niceString(this.state.media.status?.toString())}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                {niceDateFormat(this.state.media.startDate)}
                                            </Text>
                                            {this.episodesValue()}
                                            <Text style={styles.TopAreaValue}>
                                                {this.state.media.genres
                                                    ?.map((x) => x.name)
                                                    .join(", ")}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.head2}>Synopsis</Text>
                            <Divider color={Colors.DIVIDER} widthPercentage={100} />
                            <LargeText text={this.state.media.synopsis} />
                            {this.state.media.background != undefined &&
                                this.state.media.background != "" ? (
                                <View>
                                    <Text style={styles.head2}>Background</Text>
                                    <Divider color={Colors.DIVIDER} widthPercentage={100} />
                                    <LargeText text={this.state.media.background} />
                                </View>
                            ) : undefined}
                            <Divider color={Colors.DIVIDER} widthPercentage={0} />
                            <Text style={styles.head2}>Your list status</Text>
                            <Divider color={Colors.DIVIDER} widthPercentage={100} />
                            <ListStatus
                                    parentRefresh={() => {
                                        void this.refresh();
                                    }}
                                id={this.state.mediaId as number}
                                props={this.state.media.myListStatus}
                                navigation={this.props.navigation}
                                route={this.props.route}
                                mediaType={this.state.mediaType}
                            />
                            <Divider color={Colors.DIVIDER} widthPercentage={0} />
                            <Text style={styles.head2}>Recommendations</Text>
                            <Divider color={Colors.DIVIDER} widthPercentage={100} />
                            <FlatList
                                horizontal={true}
                                data={this.state.media.recommendations?.map((x) => ({
                                    ...x,
                                    node: {
                                        ...x.node,
                                        mediaType: this.state.mediaType,
                                    },
                                } as (AnimeListData | MangaListData)))}
                                renderItem={(item) => (
                                    <MediaItem
                                        item={item.item}
                                        width={150 * sizer}
                                        navigator={this.props.navigation}
                                    />
                                )}
                                keyExtractor={(_, index) => index.toString()}
                            />
                            <Divider color={Colors.DIVIDER} widthPercentage={0} />
                            <View
                                style={styles.extraRoom}
                            />
                        </ScrollView>
                    )}
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: Colors.INVISIBLE_BACKGROUND,
    },
    loading: {
        marginTop: Dimensions.get("window").height / 2,
    },
    image: {
        width: Dimensions.get("window").width / 2.5,
        height: (Dimensions.get("window").width / 2.5) * 1.5,
    },
    title: {
        color: Colors.TEXT,
        fontSize: fontSize + 4,
        marginLeft: 5,
    },
    alternateTitle: {
        color: Colors.SUBTEXT,
        marginLeft: 5,
        fontSize: fontSize + 2,
    },
    page: {
        margin: 10,
    },
    TopArea: {
        flexDirection: "row",
        alignItems: "stretch",
        width: Dimensions.get("window").width - 20,
        marginBottom: 10,
    },
    TitleArea: {
        flexDirection: "column",
        marginLeft: 10,
        flex: 1,
    },
    head2: {
        fontSize: fontSize + 4,
        color: Colors.TEXT,
    },
    TopAreaLabels: {
        flexDirection: "column",
        flex: 1.3,
    },
    TopAreaValues: {
        flexDirection: "column",
        flex: 2,
    },
    TopAreaData: {
        flexDirection: "row",
    },
    TopAreaLabel: {
        color: Colors.TEXT,
        fontWeight: "bold",
        fontSize: 12,
    },
    TopAreaValue: {
        color: Colors.TEXT,
        fontSize: 12,
    },
    extraRoom: {
        height: 80,
        width: 5,
    }
});

function valueOrND(val: number | undefined) {
    return val === 0 || val === undefined ? "N/A" : val;
}