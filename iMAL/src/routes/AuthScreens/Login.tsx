import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Auth from "../../APIManager/Authenticate";
import { Colors } from "../../Configuration/Colors";
import Kurabu from "../../../assets/pinklogin.svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../AuthStack";
import { RouteProp } from "@react-navigation/core";
import { SetRootSwitch } from "../../../App";

type LoginProps = {
    navigation: StackNavigationProp<AuthStackParamList, "Login">;
    route: RouteProp<AuthStackParamList, "Login">;
};

type LoginState = {
    navigator: StackNavigationProp<AuthStackParamList, "Login">;
    email: string;
    pass: string;
};

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            navigator: props.navigation,
            email: "",
            pass: "",
        };
    }

    private changeEmail(newstr: string) {
        this.setState({ ...this.state, email: newstr });
    }

    private changePass(newstr: string) {
        this.setState({ ...this.state, pass: newstr });
    }

    private DoLogin() {
        console.log("login do login");
        Auth.getInstance().then((auth) => {
            console.log("login get auth");
            auth.Trylogin(this.state.email, this.state.pass).then((res) => {
                console.log("login before if");
                if (res === true) {
                    console.log("login drawer");
                    SetRootSwitch("Drawer");
                }
            });
        });
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
                    style={{
                        position: "absolute",
                    }}
                />
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                    <View style={{ width: 10, height: "30%" }}></View>
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
                        onPress={this.DoLogin.bind(this)}>
                        <Text style={styles.LoginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={{ color: "white" }}>No Account?</Text>
                    <TouchableOpacity
                        style={styles.SignupButton}
                        activeOpacity={0.6}
                        onPress={this.DoSignup.bind(this)}>
                        <Text style={styles.SignupButtonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    head: {
        color: Colors.TEXT,
        fontSize: 60,
        fontFamily: "AGRevueCyr",
    },
    Input: {
        width: 250,
        height: 50,
        borderBottomColor: Colors.INPUT_UNDERLINE,
        borderBottomWidth: 1,
        color: Colors.TEXT,
        fontSize: 20,
        marginTop: 15,
    },
    LoginButton: {
        borderRadius: 4,
        backgroundColor: Colors.CYAN,
        paddingHorizontal: 97,
        paddingVertical: 10,
        marginTop: 90,
        marginBottom: 40,
        color: Colors.TEXT,
    },
    LoginButtonText: {
        color: Colors.TEXT,
        fontSize: 18,
        fontWeight: "bold",
    },
    SignupButton: {
        borderRadius: 4,
        backgroundColor: Colors.CYAN,
        paddingHorizontal: 60,
        paddingVertical: 6,
        marginTop: 5,
        color: Colors.TEXT,
    },
    SignupButtonText: {
        color: Colors.TEXT,
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Login;
