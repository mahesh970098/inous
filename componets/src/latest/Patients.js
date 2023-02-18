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
// import { Dropdown } from 'react-native-material-dropdown';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    // { label: 'Item 3', value: '3' },
    // { label: 'Item 4', value: '4' },
    // { label: 'Item 5', value: '5' },
    // { label: 'Item 6', value: '6' },
    // { label: 'Item 7', value: '7' },
    // { label: 'Item 8', value: '8' },
];


const data1 = [
    { label: 'Covin', value: '1' },
    { label: 'Temp', value: '2' },
    // { label: 'Item 3', value: '3' },
    // { label: 'Item 4', value: '4' },
    // { label: 'Item 5', value: '5' },
    // { label: 'Item 6', value: '6' },
    // { label: 'Item 7', value: '7' },
    // { label: 'Item 8', value: '8' },
];

const Patients = ({ navigation }) => {
    var height = Dimensions.get("window").height;
    var width = Dimensions.get("window").width;
    // const [data, setdata] = useState([''])
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };


    useEffect(() => {

    }, [])
    const test = () => {
        navigation.navigate('Test')
    }
    return (
        <SafeAreaView style={styles.container}>
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
                                Patients Details
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
                {/* <Text>Patients Details</Text> */}

            </View>

            <View style={{ flexDirection: 'row', width: width * 1, justifyContent: 'space-around', marginTop: hp('10%') }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: '#000' }}>patient</Text>
                </View>
                <View >
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        // selectedTextStyle={styles.selectedTextStyle}
                        // inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                        }}
                    /></View>
            </View>



            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('10%') }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: '#000' }}>Test Profile</Text>
                </View>
                <View>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        // selectedTextStyle={styles.selectedTextStyle}
                        // inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data1}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                        }}
                    /></View>
            </View>

            <View style={styles.bottomView}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={test}>
                        <View style={styles.btn}>
                            <Text style={{ color: '#fff' }}>Test</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}
export default Patients
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: width * 0.5
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    btn: {
        width: Dimensions.get("window").width * 0.6,
        height: Dimensions.get("window").width * 0.1,

        borderRadius: 5,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff0000",
        // marginTop: hp("2%"),
    },
    bottomView: {
        // width: "100%",
        width: width,
        // height: hp("16%"),
        height: height * 0.06,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute", //Here is the trick
        bottom: 25, //Here is the trick
        shadowOpacity: 0.4,
        shadowColor: "#000000",
        shadowRadius: 3,
        elevation: 5,
    },
})