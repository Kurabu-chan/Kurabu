import React from 'react';

import { GetMangaDetails } from '#api/Manga/MangaDetails';
import {
  changeActivePage,
  changeTopRightButton,
  getActiveScreen,
} from '#routes/MainDrawer';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { GetAnimeDetails } from '../../APIManager/Anime/AnimeDetails';
import { Media } from '../../APIManager/ApiBasicTypes';
import { Divider } from '../../components/Divider';
import { LargeText } from '../../components/LargeText';
import MediaItem from '../../components/MediaItem';
import { Colors } from '../../Configuration/Colors';
import { HomeStackParamList } from '../MainStacks/HomeStack';

type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "Details">;
    route: RouteProp<HomeStackParamList, "Details">;
};

type State = {
    mediaId?: number;
    anime?: Media;
    listenerToUnMount: any;
    page: string;
    mediaType: string;
};

var sizer = Dimensions.get("window").width / 400;

export default class Details extends React.Component<Props, State> {
    private styles = StyleSheet.create({
        appContainer: {
            backgroundColor: Colors.INVISIBLE_BACKGROUND,
        },
    });

    constructor(props: Props) {
        super(props);
        let mediaId = props.route.params.id;
        let mediaType = props.route.params.media_type;
        if (mediaId == undefined) {
            mediaId = 1;
        }
        console.log(`${mediaType} ${mediaId}`);
        this.state = {
            mediaId: mediaId,
            listenerToUnMount: undefined,
            page: getActiveScreen(),
            mediaType: mediaType,
        };

        const mangaMediatTypes = [
            "manga",
            "light_novel",
            "manhwa",
            "one_shot",
            "manhua",
            "doujinshi",
            "novel",
        ];

        if (mangaMediatTypes.includes(mediaType)) {
            GetMangaDetails(mediaId)
                .then((res) => {
                    this.setState({
                        mediaId: mediaId,
                        anime: res,
                    });
                })
                .catch((err) => {
                    console.log("Manga details error weewooweewoo");
                    console.log(err);
                });
        } else {
            GetAnimeDetails(mediaId)
                .then((res) => {
                    this.setState({
                        mediaId: mediaId,
                        anime: res,
                    });
                })
                .catch((err) => {
                    console.log("Anime details error weewooweewoo");
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        changeTopRightButton(this.state.page as any, () => {
            this.props.navigation.popToTop();
            changeTopRightButton(this.state.page as any, undefined);
        });

        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage(this.state.page as any);
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

    NiceString(text: string | undefined) {
        if (text == undefined) return "";
        text = text.replace("_", " ");
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    render() {
        return (
            <SafeAreaView style={this.styles.appContainer}>
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
                    }}>
                    {this.state.anime == undefined ? (
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
                                        uri: this.state.anime?.main_picture
                                            ?.large,
                                    }}
                                />
                                <View style={styles.TitleArea}>
                                    <Text style={styles.title}>
                                        {this.state.anime.title}
                                    </Text>
                                    {this.state.anime.title !=
                                    this.state.anime.alternative_titles?.en ? (
                                        <Text style={styles.alternateTitle}>
                                            {
                                                this.state.anime
                                                    .alternative_titles?.en
                                            }
                                        </Text>
                                    ) : undefined}
                                    <Text style={styles.alternateTitle}>
                                        {
                                            this.state.anime.alternative_titles
                                                ?.ja
                                        }
                                    </Text>
                                    <Divider
                                        color={Colors.DIVIDER}
                                        widthPercentage={100}
                                    />
                                    <View style={styles.TopAreaData}>
                                        <View style={styles.TopAreaLabels}>
                                            <Text style={styles.TopAreaLabel}>
                                                Score:
                                            </Text>
                                            <Text style={styles.TopAreaLabel}>
                                                Rank:
                                            </Text>
                                            <Text style={styles.TopAreaLabel}>
                                                Popularity:
                                            </Text>
                                        </View>
                                        <View style={styles.TopAreaValues}>
                                            <Text style={styles.TopAreaValue}>
                                                {this.state.anime.mean}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                #{this.state.anime.rank}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                #{this.state.anime.popularity}
                                            </Text>
                                        </View>
                                    </View>
                                    <Divider
                                        color={Colors.DIVIDER}
                                        widthPercentage={100}
                                    />
                                    <View style={styles.TopAreaData}>
                                        <View style={styles.TopAreaLabels}>
                                            <Text style={styles.TopAreaLabel}>
                                                Status:
                                            </Text>
                                            <Text style={styles.TopAreaLabel}>
                                                Aired:
                                            </Text>
                                            <Text style={styles.TopAreaLabel}>
                                                Episodes:
                                            </Text>
                                            <Text style={styles.TopAreaLabel}>
                                                Genres:
                                            </Text>
                                        </View>
                                        <View style={styles.TopAreaValues}>
                                            <Text style={styles.TopAreaValue}>
                                                {this.NiceString(
                                                    this.state.anime.status
                                                )}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                {this.state.anime.start_date}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                {this.state.anime
                                                    .num_episodes == 0
                                                    ? "N/A"
                                                    : this.state.anime
                                                          .num_episodes}
                                            </Text>
                                            <Text style={styles.TopAreaValue}>
                                                {this.state.anime.genres
                                                    ?.map((x) => x.name)
                                                    .join(", ")}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.head2}>Synopsis</Text>
                            <Divider
                                color={Colors.DIVIDER}
                                widthPercentage={100}
                            />
                            <LargeText text={this.state.anime.synopsis} />
                            {this.state.anime.background != undefined &&
                            this.state.anime.background != "" ? (
                                <View>
                                    <Text style={styles.head2}>Background</Text>
                                    <Divider
                                        color={Colors.DIVIDER}
                                        widthPercentage={100}
                                    />
                                    <LargeText
                                        text={this.state.anime.background}
                                    />
                                </View>
                            ) : undefined}
                            <Divider
                                color={Colors.DIVIDER}
                                widthPercentage={0}
                            />
                            <Text style={styles.head2}>Recommendations</Text>
                            <Divider
                                color={Colors.DIVIDER}
                                widthPercentage={100}
                            />
                            <FlatList
                                horizontal={true}
                                data={this.state.anime.recommendations?.map(
                                    (x) => ({
                                        ...x,
                                        node: {
                                            ...x.node,
                                            media_type: this.state.mediaType,
                                        },
                                    })
                                )}
                                renderItem={(item) => (
                                    <MediaItem
                                        item={item.item}
                                        width={150 * sizer}
                                        navigator={this.props.navigation}
                                    />
                                )}
                                keyExtractor={(_, index) => index.toString()}
                            />
                            <Divider
                                color={Colors.DIVIDER}
                                widthPercentage={0}
                            />
                            <View
                                style={{
                                    height: 80,
                                    width: 5,
                                }}
                            />
                        </ScrollView>
                    )}
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

var fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
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
    Synopsis: {
        color: Colors.TEXT,
    },
    ReadMore: {
        color: Colors.BLUE,
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        textDecorationColor: Colors.BLUE,
        fontSize: fontSize,
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
});
