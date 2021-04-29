import React from "react";
import { Text, View, Linking, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import Authentication from "../../APIManager/Authenticate";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../Configuration/Colors";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../AuthStack";
import * as RootNavigator from "../RootNavigator";

type RegisterProps = {
    navigation: StackNavigationProp<AuthStackParamList, "Verify">;
    route: RouteProp<AuthStackParamList, "Verify">;
};

type State = {
    uuid: string;
    code: string;
    failed: boolean;
    attempt: number;
};

export default class Verif extends React.Component<RegisterProps, State> {
    constructor(props: RegisterProps) {
        super(props);
        this.state = {
            uuid: props.route.params.uuid,
            code: "",
            failed: false,
            attempt: 0,
        };
    }

    async Submit(code: string): Promise<boolean> {
        let auth = await Authentication.getInstance();
        let uuid = auth.GetStateCode();
        if (uuid == undefined) {
            Alert.alert(
                "An error occured during the authentication process, please retry entering the verification code. If that doesn't work close and open the app."
            );
            return false;
        }
        let resp = await auth.TryVerif(uuid, code);
        if (resp.status == "error") {
            Alert.alert(resp.message);
            return false;
        } else {
            //open browser
            Linking.openURL(resp.message);
            return true;
        }
    }

    async Cancel() {
        let auth = await Authentication.getInstance();
        let uuid = auth.GetStateCode();
        if (uuid == undefined) {
            Alert.alert(
                "An error occured during the authentication process, please retry canceling. If that doesn't work close and open the app."
            );
            return false;
        }
        let result = await auth.TryCancelRegister(uuid);
        if (result) {
            console.log("Going to register and clearing stateCode");
            auth.ClearCode();

            RootNavigator.navigate("Register", undefined);
        }
    }

    async SetCode(code: string) {
        if (code.match(/.*\D.*/)) return;

        this.setState((prevState) => ({ ...prevState, code: code }));

        if (code.length == 6) {
            if (!(await this.Submit(code))) {
                this.setState((prevState) => ({
                    ...prevState,
                    code: "",
                    failed: true,
                }));
            }
        } else {
            console.log(
                "hey: " + code.length.toString() + " " + this.state.failed
            );
        }
    }

    render() {
        const CELL_COUNT = 6;

        type renderCell = {
            index: any;
            symbol: any;
            isFocused: any;
        };

        return (
            <View style={styles.appContainer}>
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                    <Text style={styles.head}>iMAL</Text>
                    <Text style={styles.sentMailText}>
                        We've sent you an email with a verification code, please
                        enter it below.
                    </Text>
                    <Text
                        style={[
                            styles.hidden,
                            this.state.failed && styles.incorrect,
                        ]}>
                        Incorrect Code
                    </Text>
                    <CodeField
                        value={this.state.code}
                        onChangeText={this.SetCode.bind(this)}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={(data: renderCell) => (
                            <Text
                                key={data.index}
                                style={[
                                    styles.cell,
                                    data.isFocused && styles.focusCell,
                                ]}>
                                {data.symbol ||
                                    (data.isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <TouchableOpacity
                        style={styles.cancel}
                        onPress={this.Cancel.bind(this)}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: "center", fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        margin: 5,
        borderWidth: 2,
        borderColor: Colors.ORANGE,
        textAlign: "center",
        color: Colors.ORANGE,
    },
    focusCell: {
        borderColor: Colors.ORANGE_SELECTED,
    },
    appContainer: {
        backgroundColor: Colors.BLUE,
        alignItems: "center",
        justifyContent: "center",
    },
    safeContainer: {
        backgroundColor: Colors.BLUE,
    },
    VerifInput: {
        width: 240,
        height: 50,
        borderBottomColor: Colors.INPUT_UNDERLINE,
        borderBottomWidth: 1,
        color: Colors.TEXT,
        fontSize: 50,
        letterSpacing: 10,
    },
    content: {
        height: Dimensions.get("window").height,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: Colors.TEXT,
        fontSize: 15,
    },
    incorrect: {
        color: Colors.ERROR,
        fontSize: 20,
        opacity: 100,
    },
    hidden: {
        opacity: 0,
    },
    sentMailText: {
        color: Colors.TEXT,
        width: Dimensions.get("window").width * 0.8,
        fontSize: 14,
        fontFamily: "AGRevueCyr",
    },
    head: {
        color: Colors.TEXT,
        fontSize: 60,
        fontFamily: "AGRevueCyr",
        marginBottom: 100,
    },
    cancel: {
        marginTop: 30,
        backgroundColor: Colors.ORANGE,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 3,
        borderColor: Colors.ORANGE_SELECTED,
        borderWidth: 1,
    },
});
