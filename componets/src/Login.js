import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";


const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const showToast = (type, message, position) => {
        Toast.show({
            type: type,
            text1: message,
            position: position,
        });
    };

    const login = () => {
        if ((email.length > 0) && (password.length > 0)) {

            if ((email == "admin") && (password == "admin")) {
                navigation.navigate('Navbar')
                console.log("Navbar")
            } else {
                showToast("info", "Invalid Credential", "top");
            }
            // navigation.navgate("Home");

        } else {
            console.log("false")
            showToast("info", "Please Enter details", "top");
        }
    }
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/splash_logo.png")} />
            {/* <StatusBar style="auto" /> */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={login}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",

    },
    image: {
        marginBottom: 5,
    },
    inputView: {
        // backgroundColor: "#FFC0CB",
        borderRadius: 10,
        width: "80%",
        height: 45,
        marginBottom: 20,
        // alignItems: "center",
        borderColor: '#000',
        borderWidth: 1
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
    },
    loginBtn: {
        width: "70%",
        borderRadius: 5,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: "#0066cc",
    },
    loginText: {
        color: '#fff'
    }
});
export default Login;