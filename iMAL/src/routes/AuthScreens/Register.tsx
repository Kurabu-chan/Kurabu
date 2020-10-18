import React from 'react';
import { StyleSheet, Text, View, TextInput,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Dimensions } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Auth from '../../APIManager/Authenticate';
import PasswordStrength from '../../components/PasswordStrength';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { Colors } from '../../Configuration/Colors';

type RegisterState = {
    email: string,
    pass: string,
    retype: string
}

class Register extends React.Component<NavigationStackScreenProps, RegisterState>{
    constructor(props: NavigationStackScreenProps) {
        super(props);
        this.state = {
            email: "",
            pass: "",
            retype: ""
        }
    }

    private changeEmail(newstr: string) {
        this.setState({ ...this.state, email: newstr });
        
    }

    private changePass(newstr: string) {
        this.setState({...this.state,pass: newstr});
    }

    private changeRetype(newstr: string) {
        this.setState({...this.state,retype: newstr});
    }

    private DoSignup() {
        Auth.getInstance().then((auth) => {
            auth.TryRegister(this.state.email, this.state.pass).then((res) => {
                if (res != "") {
                    //we got the uuid for the verification
                    auth.setCode(res);
                    console.log("Obtained uuid: " + res);
                    //OLD: Linking.openURL(res);
                    this.props.navigation.replace("Verify");
                }
            });
        }); 
    }

    private DoSignin() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.appContainer}>
                <SafeAreaView style={styles.safeContainer} />
                <View style={styles.content}>
                    <Text style={styles.head}>Sign up</Text>
                    <TextInput onChangeText={this.changeEmail.bind(this)}
                        placeholder="Email"
                        autoCompleteType="email"
                        style={styles.Input}
                        value={this.state.email} />
                    <TextInput onChangeText={this.changePass.bind(this)}
                        placeholder="Password"
                        autoCompleteType="password"
                        secureTextEntry
                        passwordRules="required: lower; required: upper; required digit; required: [~!@#$%^*_-+=`|(){}[:;'<>,.? \]]; minlength: 8;"
                        spellCheck={false}
                        style={styles.Input}
                        value={this.state.pass} />
                    <PasswordStrength pass={this.state.pass} />
                    <TextInput onChangeText={this.changeRetype.bind(this)}
                        placeholder="Retype Password"
                        autoCompleteType="password"
                        secureTextEntry
                        spellCheck={false}
                        style={styles.Input}
                        value={this.state.retype} />                    
                    <TouchableOpacity
                        style={styles.SignupButton}
                        activeOpacity={0.6}
                        onPress={this.DoSignup.bind(this)}>
                        <Text style={styles.SignupButtonText}>Sign up</Text>
                    </TouchableOpacity>
                    <Text style={{color:'white'}}>
                        Have an account?
                    </Text>
                    <TouchableOpacity
                        style={styles.LoginButton}
                        activeOpacity={0.6}
                        onPress={this.DoSignin.bind(this)}>
                        <Text style={styles.LoginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND
    },
    safeContainer: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND
    },
    content: {
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center'
    },
    head: {
        color: Colors.TEXT,
        fontSize: 60,
        fontFamily: 'AGRevueCyr'
    },
    Input: {
        width: 250,
        height: 50,
        borderBottomColor: Colors.INPUT_UNDERLINE,
        borderBottomWidth: 1,
        color: Colors.TEXT,
        fontSize: 20,
        marginTop:15
    },
    SignupButton: {
        borderRadius: 4,
        backgroundColor: Colors.BLUE,
        paddingHorizontal: 97,
        paddingVertical: 10,
        marginTop: 40,
        marginBottom: 40,
        color: Colors.TEXT
    },
    SignupButtonText: {
        color: Colors.TEXT,
        fontSize: 18,
        fontWeight: "bold"
    },
    LoginButton: {
        borderRadius: 4,
        backgroundColor: Colors.BLUE,
        paddingHorizontal: 60,
        paddingVertical: 6,
        marginTop: 5,
        color: Colors.TEXT
    },
    LoginButtonText: {
        color: Colors.TEXT,
        fontSize: 18,
        fontWeight: "bold"
    }
});

export default Register;