import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, Dimensions, Linking, StyleSheet, Text, View } from "react-native";
import { CodeField, Cursor, RenderCellOptions } from "react-native-confirmation-code-field";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Authentication from "#api/Authenticate";
import { Colors } from "#config/Colors";
import { AuthStackParamList } from "../AuthStack";
import * as RootNavigator from "../RootNavigator";
import Kurabu from "../../../assets/pinklogin.svg";
import { AuthBackground } from "#comps/AuthBackgrounds";

type RegisterProps = {
    navigation: StackNavigationProp<AuthStackParamList, "Verify">;
    route: RouteProp<AuthStackParamList, "Verify">;
};

type State = {
    token: string;
    code: string;
    failed: boolean;
    attempt: number;
};

export default class Verif extends React.Component<RegisterProps, State> {
    constructor(props: RegisterProps) {
        super(props);
        this.state = {
            token: props.route.params.token,
            code: "",
            failed: false,
            attempt: 0,
        };
    }

    async Submit(code: string): Promise<boolean> {
        const auth = await Authentication.getInstance();
        const token = await auth.GetToken();
        if (token == undefined) {
            Alert.alert(
                "An error occured during the authentication process, please retry entering the verification code. If that doesn't work close and open the app."
            );
            return false;
        }
        const resp = await auth.TryVerif(token, code);
        if (resp.status == "error") {
            Alert.alert(resp.message);
            return false;
        } else {
            //open browser
            await Linking.openURL(resp.message);
            return true;
        }
    }

    async Cancel() {
        const auth = await Authentication.getInstance();
        const token = await auth.GetToken();
        if (token == undefined) {
            Alert.alert(
                "An error occured during the authentication process, please retry canceling. If that doesn't work close and open the app."
            );
            return false;
        }
        const result = await auth.TryCancelRegister(token);
        if (result) {
            console.log("Going to register and clearing token");
            await auth.ClearToken();

            RootNavigator.navigate("Register", undefined);
        }
    }

    async SetCode(code: string) {
        if (code.match(/.*\D.*/)) return;

        this.setState((prevState) => ({
            ...prevState,
            code: code,
        }));

        if (code.length == 6) {
            if (!(await this.Submit(code))) {
                this.setState((prevState) => ({
                    ...prevState,
                    code: "",
                    failed: true,
                }));
            }
        }
    }

    render() {
        const CELL_COUNT = 6;

        return (
            <View>
				<AuthBackground inverted={false} />
                <SafeAreaView />
                <View style={styles.content}>
                    {/* <Text style={styles.head}>Kurabu</Text> */}
                    <Text style={styles.sentMailText}>
                        We've sent you an email with a verification code, please enter it below.
                    </Text>
                    <Text style={[styles.hidden, this.state.failed && styles.incorrect]}>
                        Incorrect Code
                    </Text>
                    <CodeField
                        value={this.state.code}
                        onChangeText={(code: string) => {
                            void this.SetCode(code);
                        }}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={(data: RenderCellOptions) => (
                            <Text
                                key={data.index}
                                style={[styles.cell, data.isFocused && styles.focusCell]}
                            >
                                {data.symbol || (data.isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <TouchableOpacity style={styles.cancel} onPress={() => {
                        void this.Cancel();
                    }}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        margin: 5,
        borderWidth: 2,
        borderColor: Colors.CYAN,
        textAlign: "center",
        color: Colors.CYAN,
    },
    focusCell: {
        borderColor: Colors.CYAN_SELECTED,
    },
    content: {
        height: Dimensions.get("window").height,
        alignItems: "center",
        justifyContent: "center",
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
        paddingRight: Dimensions.get("window").width * 0.3,
        fontSize: 16,
        fontFamily: "AGRevueCyr",
        paddingTop: 100,
    },
    cancel: {
        marginTop: 30,
        backgroundColor: Colors.CYAN,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 3,
        borderColor: Colors.CYAN_SELECTED,
        borderWidth: 1,
    },
});
