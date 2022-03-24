import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NoImageKurabu from "../../assets/NoImageKurabu.svg";
import { Colors } from "#config/Colors";
import { AnimeListData, MangaListData } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/native";

type MediaItemProps = {
    item: AnimeListData | MangaListData;
    width?: number;
    navigator: StackNavigationProp<ParamListBase, string>;
};

type MediaItemState = {
    item: AnimeListData | MangaListData;
    navigator: StackNavigationProp<ParamListBase, string>;
};

class MediaItem extends React.Component<MediaItemProps, MediaItemState> {
    constructor(props: MediaItemProps) {
        super(props);

        this.state = {
            item: props.item,
            navigator: props.navigator,
        };
    }

    public openDetails() {
        // changeTopRightButton(() => {
        //     this.state.navigator.popToTop();
        //     changeTopRightButton(undefined);
        // });

        this.state.navigator.push("DetailsScreen", {
            id: this.state.item.node.id,
            mediaType: this.state.item.node.mediaType,
        });
    }

    render() {
        const width = this.props.width ?? Dimensions.get("window").width / 2 - 15;

        const fontSize = Dimensions.get("window").width / 34;

        const sizer = Dimensions.get("window").width / 400;

        const styles = StyleSheet.create({
            mediaContainer: {
                // height: 200,
                width: width,
                marginTop: 10,
                marginLeft: 10,
            },
            title: {
                fontSize: fontSize,
                color: Colors.TEXT,
                textAlign: "center",
                position: "absolute",
                backgroundColor: Colors.TRANSPARENT_BACKGROUND,
                // top: (1.5 * width) - 50 * sizer,
                left: 0,
                right: 0,
                bottom: 0,
                paddingTop: 5,
                paddingBottom: 5,
                paddingRight: 5,
                paddingLeft: 5,
                minHeight: 40 * sizer,
            },
            image: {
                width: width,
                height: 1.5 * width,
            },
        });

        return (
            <TouchableOpacity style={styles.mediaContainer} onPress={this.openDetails.bind(this)}>
                {this.state.item.node.mainPicture !== undefined ? (
                    <Image
                        style={styles.image}
                        source={{
                            uri: this.state.item.node.mainPicture.medium,
                        }}
                    />
                ) : (
                    <View style={styles.image}>
                        <NoImageKurabu style={styles.image} />
                    </View>
                )}
                <Text style={styles.title}>{this.state.item.node.title}</Text>
            </TouchableOpacity>
        );
    }
}

export default MediaItem;
