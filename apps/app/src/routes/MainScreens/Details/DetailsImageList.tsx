import React from "react";
import { AnimeDetailsMainPicture } from "@kurabu/api-sdk";
import { FlatList } from "react-native-gesture-handler";
import { Dimensions, ListRenderItemInfo, SafeAreaView, StyleSheet } from "react-native";
import { DetailsImageListItem } from "#comps/DetailsImageListItem";
import { StackNavigationProp } from "@react-navigation/stack";
import { DetailsStackParamList } from "#routes/MainStacks/DetailsStack";
import { RouteProp } from "@react-navigation/core";
import { Colors } from "#config/Colors";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { Typography } from "#comps/themed/Typography";

type Props = {
	navigation: StackNavigationProp<DetailsStackParamList, "DetailsImageListScreen">;
	route: RouteProp<DetailsStackParamList, "DetailsImageListScreen">;
}

export class DetailsImageList extends React.Component<Props> {
	render() {
		return (
			<SafeAreaView style={styles.appContainer}>
				<MainGradientBackground>
					<Typography
						colorVariant="background"
						isOnContainer={false}
						textKind="header"
						variant="headline3"
						style={styles.title}
					>
						Pictures
					</Typography>
					<FlatList
						data={this.props.route.params.picture}
						numColumns={2}
						renderItem={(props: ListRenderItemInfo<AnimeDetailsMainPicture>) => {
							return (<DetailsImageListItem picture={props.item} navigation={this.props.navigation} />);
						}}
						style={styles.imageList}
						contentContainerStyle={styles.imageListContentContainer}
						keyExtractor={(item: AnimeDetailsMainPicture, index: number) => index.toString()}
					/>
				</MainGradientBackground>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	appContainer: {
		backgroundColor: Colors.INVISIBLE_BACKGROUND,
		flex: 1
	},
	imageList: {
		height: Dimensions.get("screen").height,
		width: Dimensions.get("screen").width
	},
	imageListContentContainer: {
		paddingBottom: 10
	},
	title: {
		padding: 10
	}
});
