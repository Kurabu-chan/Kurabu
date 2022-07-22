import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { DetailsStackParamList } from "#routes/MainStacks/DetailsStack";
import { AnimeDetailsMainPicture } from "@kurabu/api-sdk";
import { AppliedStyles, sizing, ThemedComponent } from "@kurabu/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
    picture: AnimeDetailsMainPicture;
    navigation: StackNavigationProp<DetailsStackParamList, "DetailsImageListScreen">;
}
export class DetailsImageListItem extends ThemedComponent<Styles, Props> {
    constructor(props: Props) {
        super(styles, props)
    }

    renderThemed(styles: AppliedStyles<Styles>) {
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
type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
    image: {
        width: sizing.vw(50, -15),
        height: sizing.vw(75, -22.5),
        marginLeft: sizing.spacing("medium"),
        marginTop: sizing.spacing("medium"),
    }
});
