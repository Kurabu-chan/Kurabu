import Authentication from '#api/Authenticate';
import { DrawerItem, DrawerItemList, DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView, View, Alert, Linking } from 'react-native';
import * as Updates from "expo-updates";
import { colors, resolve, sizing, ThemeApplier, useThemeProvider } from '@kurabu/theme';
import { ThemedStyleSheet } from '#helpers/ThemedStyleSheet';

export function CustomDrawerContentComponent(props: DrawerContentComponentProps) {
	const providedTheme = useThemeProvider();

	return (
		<ThemeApplier style={styles}>
			{({styles}) => (
				<DrawerContentScrollView>
					<SafeAreaView style={styles.container}>
						<View>
							<DrawerItemList descriptors={props.descriptors} navigation={props.navigation} state={props.state} />
						</View>
						<View style={styles.bottomListContainer}>
							<DrawerItem
								label={"Discord"}
								onPress={() => {
									Alert.alert("Discord?", "Are you sure you want to go to discord?", [
										{ text: "Cancel", onPress: () => { return; }, style: "cancel" },
										{
											text: "Proceed", onPress: () => {
												void Linking.openURL("https://discord.gg/dSvnuSE7Jg");
											}
										}
									])

								}}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								activeBackgroundColor={resolve(colors.color("primary"), providedTheme)}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								inactiveBackgroundColor={resolve(colors.color("surface"), providedTheme)}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								activeTintColor={resolve(colors.onColor("primary", "paragraph"), providedTheme)}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								inactiveTintColor={resolve(colors.onColor("surface", "paragraph"), providedTheme)}
								style={styles.drawerItemStyle}
							/>
							<DrawerItem
								label={"Logout"}
								onPress={() => {
									Alert.alert("Logout?", "Are you sure you want to logout?", [
										{ text: "Cancel", onPress: () => { return; }, style: "cancel" },
										{
											text: "Logout", onPress: () => {
												void Authentication.ClearAsync();
												void Updates.reloadAsync();
											}
										}
									])
								}}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								activeBackgroundColor={resolve(colors.color("primary"), providedTheme)}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								inactiveBackgroundColor={resolve(colors.color("surface"), providedTheme)}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								activeTintColor={resolve(colors.onColor("primary", "paragraph"), providedTheme)}
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								inactiveTintColor={resolve(colors.onColor("surface", "paragraph"), providedTheme)}
								style={styles.drawerItemStyle}
							/>
						</View>
					</SafeAreaView>
				</DrawerContentScrollView >
			)}
		</ThemeApplier>
	);

}

const styles = ThemedStyleSheet.create({
	container: {
		flex: 1,
		minHeight: sizing.vh(100),
	},
	drawerItemStyle: {
		width: "100%",
		margin: 0,
		borderRadius: sizing.rounding<number>("extraSmall")
	},
	bottomListContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: 60,
	}
	// bottomPart: {
	//     flexDirection: 'row',
	//     alignItems: 'center',
	//     width: "100%",
	//     padding: 8,
	//     backgroundColor: Colors.KURABUPINK
	// }
});
