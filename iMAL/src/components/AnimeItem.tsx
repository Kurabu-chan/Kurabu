import React from "react";
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Colors } from "../Configuration/Colors";
import { AnimeNode } from "../APIManager/ApiBasicTypes";
import NoImageKurabu from "../../assets/NoImageKurabu.svg";
import { StackNavigationProp } from "@react-navigation/stack";

type AnimeItemProps = {
    item: AnimeNode;
    width?: number;
    navigator: StackNavigationProp<any, any>;
};

type AnimeItemState = {
    item: AnimeNode;
    navigator: StackNavigationProp<any, any>;
};

class AnimeItem extends React.Component<AnimeItemProps, AnimeItemState> {
    constructor(props: AnimeItemProps) {
        super(props);

        this.state = {
            item: props.item,
            navigator: props.navigator,
        };
    }

    public openDetails() {
        this.state.navigator.push("Details", this.state);
    }

    render() {
        var width = this.props.width ?? Dimensions.get("window").width / 2 - 15;

        const styles = StyleSheet.create({
            animeContainer: {
                // height: 200,
                width: width,
                marginTop: 10,
                marginLeft: 10,
            },
            title: {
                fontSize: 14,
                marginLeft: 5,
                color: Colors.TEXT,
            },
            image: {
                width: width,
                height: 1.5 * width,
            },
        });

        return (
            <TouchableOpacity
                style={styles.animeContainer}
                onPress={this.openDetails.bind(this)}>
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
                <Text style={styles.title}>{this.state.item.node.title}</Text>
            </TouchableOpacity>
        );
    }
}

export default AnimeItem;
