import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NoImageKurabu from "../../assets/NoImageKurabu.svg";
import { Fields, MediaNode } from "#api/ApiBasicTypes";
import { Colors } from "#config/Colors";
import { Divider } from "./Divider";

type DetailedUpdateItemProps = {
    item: MediaNode;
    navigator: StackNavigationProp<any, any>;
};

type DetailedUpdateItemState = {
    item: MediaNode;
    navigator: StackNavigationProp<any, any>;
};

export const DetailedUpdateItemFields = [
    Fields.id,
    Fields.genres,
    Fields.main_picture,
    Fields.title,
    Fields.mean,
    Fields.rank,
    Fields.popularity,
    Fields.num_episodes,
    Fields.status,
    Fields.start_date,
];

export class DetailedUpdateItem extends React.PureComponent<
    DetailedUpdateItemProps,
    DetailedUpdateItemState
> {
    constructor(props: DetailedUpdateItemProps) {
        super(props);
        let item = props.item;
        if (item == undefined) {
            item = {
                node: {
                    id: 1,
                    title: "failure",
                    main_picture: {
                        medium: "https://image.shutterstock.com/image-photo/portrait-surprised-cat-scottish-straight-260nw-499196506.jpg",
                        large: "https://image.shutterstock.com/image-photo/portrait-surprised-cat-scottish-straight-260nw-499196506.jpg",
                    },
                },
            };
        }

        this.state = {
            item: item,
            navigator: props.navigator,
        };
    }

    public openDetails() {
        this.state.navigator.push("DetailsScreen", {
            id: this.state.item.node.id,
            media_type: this.state.item.node.media_type,
        });
    }

    NiceString(text: string | undefined) {
        if (text == undefined) return "";
        text = text.replace(/_/g, " ");
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    render() {
        return (
            <TouchableOpacity style={styles.mediaContainer} onPress={this.openDetails.bind(this)}>
                {this.state.item.node.main_picture !== undefined ? (
                    <Image
                        style={styles.image}
                        source={{
                            uri: this.state.item.node.main_picture.medium,
                        }}
                    />
                ) : (
                    <View style={styles.image}>
                        <NoImageKurabu style={styles.image} />
                    </View>
                )}
                <View style={styles.TitleArea}>
                    <Text style={styles.title}>{this.state.item.node.title}</Text>
                    <Divider color={Colors.DIVIDER} widthPercentage={100} />
                    <View style={TopArea.Data}>
                        <View style={TopArea.TopLeftLabels}>
                            <Text style={TopArea.Label}>Score:</Text>
                            <Text style={TopArea.Label}>Rank:</Text>
                        </View>
                        <View style={TopArea.TopLeftValues}>
                            <Text style={TopArea.Value}>{this.state.item.node.mean ?? "NA"}</Text>
                            <Text style={TopArea.Value}>
                                {this.state.item.node.rank ? "#" + this.state.item.node.rank : "NA"}
                            </Text>
                        </View>
                        <View style={TopArea.TopRightLabels}>
                            <Text style={TopArea.Label}>Episodes:</Text>
                            <Text style={TopArea.Label}>Popularity:</Text>
                        </View>
                        <View style={TopArea.TopRightValues}>
                            <Text style={TopArea.Value}>
                                {this.state.item.node.num_episodes == 0
                                    ? "N/A"
                                    : this.state.item.node.num_episodes}
                            </Text>
                            <Text style={TopArea.Value}>#{this.state.item.node.popularity}</Text>
                        </View>
                    </View>
                    <Divider color={Colors.DIVIDER} widthPercentage={100} />
                    <View style={TopArea.Data}>
                        <View style={TopArea.Labels}>
                            <Text style={TopArea.Label}>Aired:</Text>
                            <Text style={TopArea.Label}>Status:</Text>
                        </View>
                        <View style={TopArea.Values}>
                            <Text style={TopArea.Value}>{this.state.item.node.start_date}</Text>
                            <Text style={TopArea.Value}>
                                {this.NiceString(this.state.item.node.status)}
                            </Text>
                        </View>
                    </View>
                    <Divider color={Colors.DIVIDER} widthPercentage={100} />
                    <View style={TopArea.Data}>
                        <View style={TopArea.Labels}>
                            <Text style={TopArea.Label}>Genres:</Text>
                        </View>
                        <View style={TopArea.Values}>
                            <Text style={TopArea.Value}>
                                {this.state.item.node.genres?.map((x) => x.name).join(", ")}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

var fontSize = Dimensions.get("window").width / 36;

const TopArea = StyleSheet.create({
    Data: {
        flexDirection: "row",
    },
    Labels: {
        flexDirection: "column",
        flex: 1,
        marginLeft: 5,
    },
    Label: {
        color: Colors.TEXT,
        fontWeight: "bold",
        fontSize: fontSize,
    },
    Values: {
        flexDirection: "column",
        flex: 3.5,
    },
    Value: {
        color: Colors.TEXT,
        fontSize: fontSize,
    },

    TopLeftLabels: {
        flexDirection: "column",
        flex: 1,
        marginLeft: 5,
    },
    TopLeftValues: {
        flexDirection: "column",
        flex: 1,
    },
    TopRightLabels: {
        flexDirection: "column",
        flex: 1.5,
        marginLeft: 5,
    },
    TopRightValues: {
        flexDirection: "column",
        flex: 1,
    },
});

const styles = StyleSheet.create({
    page: {
        margin: 10,
    },
    mediaContainer: {
        borderRadius: 10,
        backgroundColor: Colors.KURABUPURPLE,
        width: Dimensions.get("window").width - 5,
        height: (Dimensions.get("window").width / 3) * 1.5,
        marginBottom: 5,
        marginLeft: 0,
        marginRight: 5,
        flexDirection: "row",
    },
    title: {
        fontSize: fontSize * 1.2,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.TEXT,
    },
    TitleArea: {
        flexDirection: "column",
        flex: 1,
        padding: 5,
    },
    image: {
        width: Dimensions.get("window").width / 3,
        height: (Dimensions.get("window").width / 3) * 1.5,
    },
});

export default DetailedUpdateItem;
