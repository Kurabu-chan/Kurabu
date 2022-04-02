import { DetailsStackParamList } from "#routes/MainStacks/DetailsStack";
import { AnimeDetailsMainPicture } from "@kurabu/api-sdk";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
    picture: AnimeDetailsMainPicture;
    navigation: StackNavigationProp<DetailsStackParamList, "DetailsImageListScreen">;
}
export class DetailsImageListItem extends React.Component<Props> {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.push("DetailsImageScreen", {
                        picture: this.props.picture
                    });
                }}>
                <Image
                    source={{
                        uri: this.props.picture.medium
                    }}
                    style={styles.image} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get("window").width / 2 - 15,
        height: (Dimensions.get("window").width / 2 - 15) * 1.5,
        marginLeft: 10,
        marginTop: 10
    }
});