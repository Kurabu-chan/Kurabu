import { ListStatus as ListStatusProps, ListStatusAnime, ListStatusManga } from "#api/ApiBasicTypes";
import { Colors } from "#config/Colors";
import { niceTextFormat } from "#helpers/textFormatting";
import React from "react";
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from "react-native";
import { Divider } from '#comps/Divider';
import TimeAgo from "react-native-timeago"
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";

type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "Details">;
    route: RouteProp<HomeStackParamList, "Details">;
    props?: ListStatusProps;
    mediaType: string
};

type State = {
    isAnime: boolean
}

export class ListStatus extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        const mangaMediatTypes = [
            "manga",
            "light_novel",
            "manhwa",
            "one_shot",
            "manhua",
            "doujinshi",
            "novel",
        ];

        this.state = {
            isAnime: !mangaMediatTypes.includes(props.mediaType)
        }
    }

    showListStatus() {
        this.props.navigation.pop();
    }

    renderAnime(props: ListStatusAnime) {
        return (
            <View style={styles.TopAreaData}>
                <View style={styles.TopAreaLabels}>
                    <Text style={styles.TopAreaLabel}>
                        Status:
                    </Text>
                    <Text style={styles.TopAreaLabel}>
                        Watched episodes:
                    </Text>
                    <Text style={styles.TopAreaLabel}>
                        Status updated:
                    </Text>
                </View>
                <View style={styles.TopAreaValues}>
                    <Text style={styles.TopAreaValue}>
                        {niceTextFormat(props.status)}
                    </Text>
                    <Text style={styles.TopAreaValue}>
                        {props.num_episodes_watched}
                    </Text>

                    <Text style={styles.TopAreaValue}>
                        <TimeAgo time={props.updated_at ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>);
    }

    renderManga(props: ListStatusManga) {
        return (
            <View style={styles.TopAreaData}>
                <View style={styles.TopAreaLabels}>
                    <Text style={styles.TopAreaLabel}>
                        Status:
                    </Text>
                    <Text style={styles.TopAreaLabel}>
                        Volumes read:
                    </Text>
                    <Text style={styles.TopAreaLabel}>
                        Chapters read:
                    </Text>
                    <Text style={styles.TopAreaLabel}>
                        Status updated:
                    </Text>
                </View>
                <View style={styles.TopAreaValues}>
                    <Text style={styles.TopAreaValue}>
                        {niceTextFormat(props.status)}
                    </Text>
                    <Text style={styles.TopAreaValue}>
                        {props.num_volumes_read}
                    </Text>
                    <Text style={styles.TopAreaValue}>
                        {props.num_chapters_read}
                    </Text>


                    <Text style={styles.TopAreaValue}>
                        <TimeAgo time={props.updated_at ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>);
    }

    render() {
        if (this.props.props === undefined) {
            return (<View>
                <View style={styles.TopAreaData}>
                    <View style={styles.TopAreaLabels}>
                        <Text style={styles.TopAreaLabel}>
                            Status:
                        </Text>
                    </View>
                    <View style={styles.TopAreaValues}>
                        <Text style={styles.TopAreaValue}>
                            {this.state.isAnime ? niceTextFormat("not-watching") : niceTextFormat("not-reading")}
                        </Text>
                    </View>
                </View>
                <Divider
                    color={Colors.DIVIDER}
                    widthPercentage={0}
                />
                {this.showListStatusButton()}
            </View>);
        }

        return (<View>
            {this.state.isAnime ?
                this.renderAnime(this.props.props as ListStatusAnime)
                : this.renderManga(this.props.props as ListStatusManga)}
            <Divider
                color={Colors.DIVIDER}
                widthPercentage={0}
            />
            {this.showListStatusButton()}
        </View>);
    }

    showListStatusButton() {
        return (<TouchableOpacity style={styles.listStatusEdit} onPress={() => {
            this.showListStatus();
        }}>
            <Text style={{
                alignSelf: "center"
            }}>Details</Text>
        </TouchableOpacity>);
    }
}

var fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
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
        fontSize: fontSize,
    },
    TopAreaValue: {
        color: Colors.TEXT,
        fontSize: fontSize,
    },
    listStatusEdit: {
        width: Dimensions.get("window").width - 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.KURABUPINK,
        fontSize: fontSize,
        color: Colors.KURABUPINK
    }
});