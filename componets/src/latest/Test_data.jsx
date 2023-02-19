
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    useColorScheme,
    Pressable,
    Dimensions,
    TouchableOpacity,
    Image,
    Modal,
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from "react-native-linear-gradient";
import LottieView from "lottie-react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

const Test_data = ({ navigation, route }) => {
    useEffect(() => {
        console.log(route.params.oxdata, "data")
        console.log(route.params.oxdatabp, "data111")


    })

    return (
        <SafeAreaView>
            <View>
                <LinearGradient
                    start={{ x: 1.0, y: 0.25 }}
                    end={{ x: 0.5, y: 2.0 }}
                    locations={[0, 0.5, 0.6]}
                    colors={["#ffcccc", "#ffcccc", "#ffcccc"]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            height: hp("7%"),
                            borderRadius: 0,
                            justifyContent: "flex-start",
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View style={{ marginTop: hp("2%") }}>
                                <Image
                                    source={require("../../assets/back.png")}
                                    style={{
                                        width: wp("7%"),
                                        height: hp("3.5%"),
                                        marginLeft: wp("5%"),
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                alignSelf: "center",
                                marginLeft: wp("5%"),
                                textShadowColor: "#fff",
                                shadowColor: "#fff",
                                shadowRadius: 0,
                            }}
                        >
                            <Text style={{ color: "#000", fontSize: 15 }}>
                                Data
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
            <View>

            </View>
            <TouchableOpacity >
                <View style={{ marginTop: hp('10%'), backgroundColor: '#e6ecff', width: width * 0.9, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center', }}>
                            <Text style={{ color: '#000', fontSize: 20, marginLeft: 10 }}>Oximeter</Text>
                        </View>
                        <View>
                            <LottieView
                                style={{
                                    width: width * 0.15,
                                    height: Dimensions.get("window").width * 0.18,
                                    justifyContent: 'center',
                                }}
                                source={require("../../assets/lf30_editor_checklist.json")} loop={true} autoPlay={true}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('2%') }}>
                        <Text style={styles.header}>SPO2</Text>
                        {/* <Text style={styles.data}>{spo}%</Text> */}

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('2%'), marginBottom: 20 }}>
                        <Text style={styles.header}>BP</Text>
                        {/* <Text style={styles.data}>{sdp}</Text> */}

                    </View>
                </View>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Test_data

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    viewWrapper12: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalView12: {
        flex: 0,
        position: "absolute",
        top: hp("40%"),
        left: wp("50%"),
        elevation: 5,
        transform: [{ translateX: -(width * 0.45) }, { translateY: -90 }],
        // height: hp("35%"),
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 20,

    },
    btn: {
        width: Dimensions.get("window").width * 0.3,
        height: Dimensions.get("window").width * 0.1,

        borderRadius: 5,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff0000",
        // marginTop: hp("2%"),
    },
    btn1: {
        width: Dimensions.get("window").width * 0.3,
        height: Dimensions.get("window").width * 0.1,

        borderRadius: 5,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#002E56",
        // marginTop: hp("2%"),
    },
    btn12: {
        width: Dimensions.get("window").width * 0.5,
        height: Dimensions.get("window").width * 0.1,

        borderRadius: 5,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#002E56",
        // marginTop: hp("2%"),
    },
    btn21: {
        width: Dimensions.get("window").width * 0.6,
        height: Dimensions.get("window").width * 0.1,

        borderRadius: 5,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff0000",
        // marginTop: hp("2%"),
    },

    header: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000'

    },
    data: {
        fontSize: 15,
        fontWeight: '400',
        color: '#000'


    }
})