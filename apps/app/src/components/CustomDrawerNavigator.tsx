import Authentication from '#api/Authenticate';
import { Colors } from '#config/Colors';
import { DrawerItem, DrawerItemList, DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView, View, StyleSheet, Dimensions, Alert, Linking } from 'react-native';
import * as Updates from "expo-updates";

export function CustomDrawerContentComponent(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView>
            <SafeAreaView style={styles.container}>
                <View
                    // style={styles.container}
                >
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
                        activeBackgroundColor={Colors.KURABUPINK}
                        inactiveBackgroundColor={Colors.ALTERNATE_CONTENT_BACKGROUND}
                        activeTintColor={"white"}
                        inactiveTintColor={"white"}
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
                        activeBackgroundColor={Colors.KURABUPINK}
                        inactiveBackgroundColor={Colors.ALTERNATE_CONTENT_BACKGROUND}
                        activeTintColor={"white"}
                        inactiveTintColor={"white"}
                        style={styles.drawerItemStyle}
                    />
                </View>
            </SafeAreaView>
        </DrawerContentScrollView >
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: Dimensions.get("window").height,
    },
    drawerItemStyle: {
        width: "100%",
        margin: 0,
        borderRadius: 2
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