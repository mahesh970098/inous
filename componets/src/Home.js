import {
    View,
    Text,
    ProgressSteps,
    ProgressStep,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking,
    BackHandler,
    Dimensions,
    Switch
} from "react-native";
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from "react-native-linear-gradient";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

const Home = ({ navigation }) => {
    var height = Dimensions.get("window").height;
    var width = Dimensions.get("window").width;
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const patients = () => {
        navigation.navigate('Patients')
    }

    const demo = () => {
        navigation.navigate('demo')
    }

    return (
        <SafeAreaView style={styles.Container}>
            <View>
                <LinearGradient
                    start={{ x: 1.0, y: 0.25 }}
                    end={{ x: 0.5, y: 2.0 }}
                    locations={[0, 0.5, 0.6]}
                    colors={["#e6ecff", "#e6ecff", "#e6ecff"]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            height: hp("7%"),
                            borderRadius: 0,
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ justifyContent: 'center' }}>
                            <Image
                                source={require("../assets/hamburger_icon.png")}
                                style={{
                                    width: width * 0.07,
                                    height: height * 0.04,
                                    marginLeft: wp("5%"),
                                }}
                            />
                        </View>
                        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View style={{ marginTop: hp("2%") }}>
                                <Image
                                    source={require("../assets/backarrows.png")}
                                    style={{
                                        width: wp("7%"),
                                        height: hp("3.5%"),
                                        marginLeft: wp("5%"),
                                    }}
                                />
                            </View>
                        </TouchableOpacity> */}
                        <View
                            style={{
                                alignSelf: "center",
                                marginLeft: wp("5%"),
                                textShadowColor: "#fff",
                                shadowColor: "#fff",
                                shadowRadius: 0,
                            }}
                        >
                            <Text style={{ color: "#000", fontSize: 19 }}>

                            </Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}

                            />
                        </View>
                        {/* 
                        <Text>Home</Text> */}
                    </View>
                </LinearGradient>

            </View>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Image style={styles.img} source={require('../assets/round_image.png')} />
            </View>
            <View style={{ marginTop: hp('5%') }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.img1} source={require('../assets/user.png')} />
                        <Text style={{ color: "#000", fontSize: 15 }}>Supervisor</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.img1} source={require('../assets/loction.png')} />
                        <Text style={{ color: "#000", fontSize: 15 }}>Hyderabad</Text>
                    </View>
                </View>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', marginTop: hp('8%') }}>
                <View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={styles.img2} source={require('../assets/assigned.png')} />
                        <Text style={{ color: "#000", fontSize: 15 }}>Assigned</Text>
                        <Text style={{ color: "#000", fontSize: 15 }}>00</Text>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={styles.img2} source={require('../assets/task.png')} />
                        <Text style={{ color: "#000", fontSize: 15 }}>Total Tasks</Text>
                        <Text style={{ color: "#000", fontSize: 15 }}>00</Text>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={styles.img2} source={require('../assets/checked.png')} />
                        <Text style={{ color: "#000", fontSize: 15 }}>Completed</Text>
                        <Text style={{ color: "#000", fontSize: 15 }}>00</Text>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('2%'), backgroundColor: '#e6ecff', width: wp('68%'), height: hp('5%'), borderRadius: wp('8%') }}>
                    <View style={{ backgroundColor: '#ccd9ff', marginLeft: hp('-3.5%'), width: hp('18%'), alignContent: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: wp('8%') }}>
                        <TouchableOpacity>
                            <Text style={{ color: '#000', fontSize: 12, fontWeight: '500' }}>Latest</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#e6ecff', width: hp('15%'), alignContent: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: wp('8%') }}>
                        <TouchableOpacity >
                            <Text style={{ color: '#000', fontSize: 12, fontWeight: '500' }}>Previous</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', marginTop: hp('5%') }}>
                <TouchableOpacity onPress={patients}>
                    <View style={styles.blue}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            <Image style={styles.img2} source={require('../assets/patient.png')} />
                            <Text style={{ color: '#000', marginTop: 15, marginBottom: 10 }}>Patients</Text>

                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={demo}>
                    <View style={styles.blue}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            <Image style={styles.img2} source={require('../assets/task.png')} />
                            <Text style={{ color: '#000', marginTop: 15, marginBottom: 10 }}>Tasks</Text>

                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.blue}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            <Image style={styles.img2} source={require('../assets/report.png')} />
                            <Text style={{ color: '#000', marginTop: 15, marginBottom: 10 }}>Reports</Text>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    img: {
        width: 100,
        height: 100,

    },
    img1: {
        width: 20,
        height: 20
    },
    img2: {
        width: 40,
        height: 40
    },
    blue: {
        backgroundColor: '#EBF2FD',
        height: 'auto',
        width: width * 0.3,
        borderRadius: 10,
        shadowColor: "black",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 13,
        overflow: 'hidden',
        alignItems: 'center'
    },

})
export default Home