import Authentication from '#api/Authenticate';
import { Colors } from '#config/Colors';
import { DrawerItem, DrawerItemList, DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView, View, StyleSheet, Dimensions, Alert } from 'react-native';
import * as Updates from "expo-updates";

export function CustomDrawerContentComponent(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <DrawerItemList descriptors={props.descriptors} navigation={props.navigation} state={props.state} />

                </View>
            </SafeAreaView>
            <SafeAreaView>
                <View>
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
        minHeight: Dimensions.get("window").height - 100
    },
    drawerItemStyle: {
        width: "100%",
        margin: 0,
        borderRadius: 2,
    }
    // bottomPart: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     width: "100%",
    //     padding: 8,
    //     backgroundColor: Colors.KURABUPINK
    // }
});