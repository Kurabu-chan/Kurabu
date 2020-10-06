import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Dimensions } from "react-native";
import { NavigationRoute, NavigationParams } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Auth from '../../APIManager/Authenticate';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationStackScreenProps } from 'react-navigation-stack';


type LoginState = {
    navigator: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>,
    email: string,
    pass: string
}

class Login extends React.Component<NavigationStackScreenProps, LoginState>{
    constructor(props: NavigationStackScreenProps) {
        super(props);
        this.state = {
            navigator: props.navigation,
            email: "",
            pass: ""
        }
    }

    private changeEmail(newstr: string) {
        this.setState({...this.state,email: newstr});
    }

    private changePass(newstr: string) {
        this.setState({...this.state,pass: newstr});
    }

    private DoLogin() {
        Auth.getInstance().then((auth) => {
            auth.Trylogin(this.state.email, this.state.pass).then((res) => {
                if (res === true) {
                    this.state.navigator.navigate("Home");
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
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                    <Text style={styles.head}>iMAL</Text>
                    <TextInput onChangeText={this.changeEmail.bind(this)}
                        placeholder="Email"
                        autoCompleteType="email"
                        style={styles.Input}
                        value={this.state.email} />
                    <TextInput onChangeText={this.changePass.bind(this)}
                        placeholder="Password"
                        autoCompleteType="password"
                        secureTextEntry
                        
                        style={styles.Input}
                        value={this.state.pass} />
                    <TouchableOpacity
                        style={styles.LoginButton}
                        activeOpacity={0.6}
                        onPress={this.DoLogin.bind(this)}>
                        <Text style={styles.LoginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={{color:'white'}}>
                        No Account?
                    </Text>
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
        backgroundColor: "#2e51a2"
    },
    safeContainer: {
        backgroundColor: "#2e51a2"
    },
    content: {
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    head: {
        color: 'white',
        fontSize: 60,
        fontFamily: 'AGRevueCyr'
    },
    Input: {
        width: 250,
        height: 50,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        color: 'white',
        fontSize: 20,
        marginTop:15
    },
    LoginButton: {
        borderRadius: 4,
        backgroundColor: '#eb6100',
        paddingHorizontal: 97,
        paddingVertical: 10,
        marginTop: 90,
        marginBottom: 40,
        color: 'white'
    },
    LoginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold"
    },
    SignupButton: {
        borderRadius: 4,
        backgroundColor: '#eb6100',
        paddingHorizontal: 60,
        paddingVertical: 6,
        marginTop: 5,
        color: 'white'
    },
    SignupButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: "bold"
    }
});

/* not rouned
width: 250,
height: 50,
borderBottomColor: 'white',
borderBottomWidth: 1,
color: 'white',
fontSize: 20,
marginTop:20
*/
/* rounded:
width: 250,
height: 50,
borderColor: 'white',
borderWidth: 1,
borderRadius: 25,
paddingLeft: 20,
color: 'white',
fontSize: 20,
marginTop:10
*/

export default Login;