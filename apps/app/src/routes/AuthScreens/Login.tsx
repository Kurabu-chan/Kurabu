import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Kurabu from "../../../assets/pinklogin.svg";
import Auth from "#api/Authenticate";
import { Colors } from "#config/Colors";
import { AuthStackParamList } from "../AuthStack";
import { DoSwitch } from "../RootNavigator";

type Props = StackScreenProps<AuthStackParamList, "Login">;

type LoginState = {
    navigator: StackNavigationProp<AuthStackParamList, "Login">;
    email: string;
    pass: string;
};

class Login extends React.Component<Props, LoginState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            navigator: props.navigation,
            email: "",
            pass: "",
        };
    }

    private changeEmail(newstr: string) {
        this.setState((prevState) => ({
            ...prevState,
            email: newstr,
        }));
    }

    private changePass(newstr: string) {
        this.setState((prevState) => ({
            ...prevState,
            pass: newstr,
        }));
    }

    private async DoLogin() {
        const auth = await Auth.getInstance()
        const loginRes = await auth.Trylogin(this.state.email, this.state.pass)
        if (loginRes === true) {
            DoSwitch("Drawer");
        }
    }

    private DoSignup() {
        this.state.navigator.navigate("Register");
    }

    render() {
        return (
            <View style={styles.appContainer}>
                <Kurabu
                    height={Dimensions.get("window").height * 1.5}
                    width={Dimensions.get("window").width * 3}
                    preserveAspectRatio="xMinYMin slice"
                    style={styles.kurabuImage}
                />
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                    <View
                        style={styles.extraSpacing}
                    ></View>
                    <TextInput
                        onChangeText={this.changeEmail.bind(this)}
                        placeholder="Email"
                        autoCompleteType="email"
                        style={styles.Input}
                        value={this.state.email}
                    />
                    <TextInput
                        onChangeText={this.changePass.bind(this)}
                        placeholder="Password"
                        autoCompleteType="password"
                        secureTextEntry
                        style={styles.Input}
                        value={this.state.pass}
                    />
                    <TouchableOpacity
                        style={styles.LoginButton}
                        activeOpacity={0.6}
                        onPress={this.DoLogin.bind(this)}
                    >
                        <Text style={styles.LoginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <Text
                        style={styles.noAccountText}
                    >
                        No Account?
                    </Text>
                    <TouchableOpacity
                        style={styles.SignupButton}
                        activeOpacity={0.6}
                        onPress={this.DoSignup.bind(this)}
                    >
                        <Text style={styles.SignupButtonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const fontSize = Dimensions.get("window").width / 36;
const sizer = Dimensions.get("window").width / 400;

const styles = StyleSheet.create({
    kurabuImage: {
        position: "absolute",
    },
    extraSpacing: {
        width: 10,
        height: `${30 * sizer}%`,
    },
    noAccountText: {
        color: Colors.TEXT,
    },
    appContainer: {
        // backgroundColor: Colors.BLUE
    },
    safeContainer: {
        // backgroundColor: Colors.BLUE
    },
    content: {
        height: Dimensions.get("window").height,
        alignItems: "center",
        justifyContent: "center",
    },
    Input: {
        width: sizer * 250,
        height: sizer * 50,
        borderBottomColor: Colors.INPUT_UNDERLINE,
        borderBottomWidth: 1,
        color: Colors.TEXT,
        fontSize: fontSize * 2,
        marginTop: sizer * 15,
    },
    LoginButton: {
        borderRadius: 4,
        backgroundColor: Colors.CYAN,
        paddingHorizontal: sizer * 97,
        paddingVertical: sizer * 10,
        marginTop: sizer * 90,
        marginBottom: sizer * 40,
        color: Colors.TEXT,
    },
    LoginButtonText: {
        color: Colors.TEXT,
        fontSize: fontSize * 1.5,
        fontWeight: "bold",
    },
    SignupButton: {
        borderRadius: 4,
        backgroundColor: Colors.CYAN,
        paddingHorizontal: sizer * 60,
        paddingVertical: sizer * 6,
        marginTop: sizer * 5,
        color: Colors.TEXT,
    },
    SignupButtonText: {
        color: Colors.TEXT,
        fontSize: fontSize * 1.5,
        fontWeight: "bold",
    },
});

export default Login;
