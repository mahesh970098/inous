
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

import Test_thermometer from './Test_thermometer'
import Test_bp from './Test_bp'
import Test_weight from './Test_weight'
// import BleManager from '../BleManger';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = false;

import BleManager from 'react-native-ble-manager';



export default function Test({ navigation }) {
    const [BoxVisible, setBoxVisible] = useState(false);
    const [BoxVisible1, setBoxVisible1] = useState(false);

    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(new Map());
    const [spo, setspo] = useState('')
    const [sdp, setsbp] = useState('')
    const [instruction, setinstruction] = useState(false)
    // const peripherals = new Map();
    console.log({ peripherals: peripherals.entries() });
    const [list, setList] = useState([]);
    var height = Dimensions.get("window").height;
    var width = Dimensions.get("window").width;

    const spodata = () => {
        setinstruction(true)
    }
    const spodata1 = () => {
        navigation.navigate('Device')
    }
    const closeqr = () => {
        setBoxVisible(false)
    }
    const load = () => {
        setBoxVisible1(true)
    }

    const loaddata = () => {
        setinstruction(true)
        // setBoxVisible1(true)
    }
    const test = () => {
        navigation.navigate('Test_oxio')
    }

    const instructionok = () => {
        setinstruction(false)
        setBoxVisible1(true)
        startScan()

    }

    const updatePeripherals = (key, value) => {
        setPeripherals(new Map(peripherals.set(key, value)));
    };

    const startScan = () => {
        if (!isScanning) {
            try {
                console.log('Scanning...');
                setIsScanning(true);
                BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleStopScan = () => {
        setIsScanning(false);
        console.log('Scan is stopped');
        setBoxVisible1(false)
    };

    const handleDisconnectedPeripheral = data => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            updatePeripherals(peripheral.id, peripheral);
        }
        console.log('Disconnected from ' + data.peripheral);
    };

    const handleUpdateValueForCharacteristic = (data) => {
        console.log(
            'Received data from ' +
            data.peripheral +
            ' characteristic ' +
            data.characteristic,
            data.value,
        );

        const buffer01 = new ArrayBuffer(16);
        const bytes = new Uint8Array(data.value);
        const pulse = new DataView(bytes.buffer).getUint16(buffer01, 3, true)
        // const battery = new Uint8Array(bytes.buffer)[14];
        console.log('Pulse Rate--------------:' + pulse);


        if (data.value.length == 4) {
            setspo(data.value[2])
            console.log("sppo222222222222222@!--------", data.value[2])
            setsbp(data.value[1])
            console.log("bp--------", sdp)
            if (data.value.length > 0) {
                setTimeout(() => {
                    BleManager.removeBond(data.peripheral)
                        .then(() => {
                            console.log("removeBond success");
                        })
                        .catch(() => {
                            console.log("fail to remove the bond");
                        });
                    BleManager.disconnect(data.peripheral)
                        .then(() => {
                            // Success code
                            console.log("Disconnected");
                        })
                        .catch((error) => {
                            // Failure code
                            console.log(error);
                        });
                    setTimeout(() => {
                        BleManager.getBondedPeripherals()
                            .then((peripherals) => {
                                if (peripherals.some((p) => p.id === device.id)) {
                                    console.log('Bond was not removed');
                                } else {
                                    console.log('Bond was successfully removed');
                                }
                            })
                            .catch((error) => {
                                console.log('Error checking bond state:', error);
                            });
                    }, 10000);

                }, 10000);
            }
            setTimeout(() => {
                BleManager.removeBond(data.peripheral)
                    .then(() => {
                        console.log("removeBond success");
                    })
                    .catch(() => {
                        console.log("fail to remove the bond");
                    });
                BleManager.disconnect(data.peripheral)
                    .then(() => {
                        // Success code
                        console.log("Disconnected");
                    })
                    .catch((error) => {
                        // Failure code
                        console.log(error);
                    });
                setTimeout(() => {
                    BleManager.getBondedPeripherals()
                        .then((peripherals) => {
                            if (peripherals.some((p) => p.id === device.id)) {
                                console.log('Bond was not removed');
                            } else {
                                console.log('Bond was successfully removed');
                            }
                        })
                        .catch((error) => {
                            console.log('Error checking bond state:', error);
                        });
                }, 5000);

            }, 4000);

        }
        BleManager.read(
            data.peripheral, data.service, data.characteristic
        )
            .then((readData) => {
                // Success code
                console.log('Read: ' + readData);
                const str = this.byteToString(readData);
                console.log('Read----------------------------: ', readData, str);
                resolve(str);


                let length = readData[0] + (readData[1] << 8) + (readData[2] << 16) + (readData[3] << 24);
                console.log('fileLength', readData, length);
                changeCode({ "type": "clear" });
                console.log(sensorData, "semesordata")

            })
            .catch((error) => {
                // Failure code
                console.log(error);
            });



    };

    const handleDiscoverPeripheral = peripheral => {
        console.log('Got ble peripheral', peripheral);
        if (peripheral.name == "My Oximeter") {
            console.log("-----------------------oxometer is identified---")


            // this.setState({ device: device });
            BleManager.connect(peripheral.id)
                .then(() => {
                    console.log('Connected');
                    BleManager.retrieveServices(peripheral.id)
                        .then((peripheralInfo) => {
                            console.log("periphal data011", peripheralInfo);
                            console.log("uuuid", peripheralInfo.advertising.serviceUUIDs[0])

                            var service = peripheralInfo.advertising.serviceUUIDs[0];
                            //     console.log("servcicesssssss", service)
                            var characteristic = 'cdeacb81-5235-4c07-8846-93a37ee6b86d';



                            BleManager.startNotification(peripheral.id, service, characteristic)
                                // BleManager.startNotification(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
                                .then((value) => {
                                    console.log(value, "valuessssssss@@@@@@@@@@")
                                    console.log(`Subscribed to values of ${peripheral.id}`);
                                })
                                .catch(error => {
                                    console.error(`Failed to subscribe to values of ${"deviceId"}:`, error);
                                });

                            BleManager.read(peripheral.id, service, characteristic)
                                .then((readData) => {


                                    console.log('Read: ' + readData);

                                    const str = this.byteToString(readData);
                                    console.log('Read----------------------------: ', readData, str);
                                    resolve(str);

                                    let length = readData[0] + (readData[1] << 8) + (readData[2] << 16) + (readData[3] << 24);
                                    console.log('fileLength', readData, length);
                                    changeCode({ "type": "clear" });

                                })
                                .catch((error) => {
                                    console.log('Error reading data', error);
                                });



                            // })

                        })
                        .catch((error) => {
                            console.log('Error retrieving services', error);
                        });
                })
                .catch((error) => {
                    console.log('Error connecting', error);
                });

        }
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        updatePeripherals(peripheral.id, peripheral);
    };

    const togglePeripheralConnection = async peripheral => {
        if (peripheral && peripheral.connected) {
            BleManager.disconnect(peripheral.id);
        } else {
            connectPeripheral(peripheral);
        }
    };

    const connectPeripheral = async peripheral => {
        try {
            if (peripheral) {
                markPeripheral({ connecting: true });
                await BleManager.connect(peripheral.id);
                markPeripheral({ connecting: false, connected: true });
            }
        } catch (error) {
            console.log('Connection error', error);
        }
        function markPeripheral(props) {
            updatePeripherals(peripheral.id, { ...peripheral, ...props });
        }
    };

    useEffect(() => {
        BleManager.start({ showAlert: false });
        const listeners = [
            bleManagerEmitter.addListener(
                'BleManagerDiscoverPeripheral',
                handleDiscoverPeripheral,
            ),
            bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
            bleManagerEmitter.addListener(
                'BleManagerDisconnectPeripheral',
                handleDisconnectedPeripheral,
            ),
            bleManagerEmitter.addListener(
                'BleManagerDidUpdateValueForCharacteristic',
                handleUpdateValueForCharacteristic,
            ),
        ];

        handleAndroidPermissionCheck();

        return () => {
            console.log('unmount');
            for (const listener of listeners) {
                listener.remove();
            }
        };
    }, []);

    const handleAndroidPermissionCheck = () => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(result => {
                if (result) {
                    console.log('Permission is OK');
                } else {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ).then(result => {
                        if (result) {
                            console.log('User accept');
                        } else {
                            console.log('User refuse');
                        }
                    });
                }
            });
        }
    };

    const savedata = () => {
        navigation.navigate('Testdata', {
            oxdata: spo,
            oxdatabp: sdp
        })
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
                                Test Process
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
            <View style={{ alignItems: 'center', marginTop: 10, width: '100%', backgroundColor: '#f2f2f2' }}>
                <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-around' }}>
                    <Text style={styles.header}>patient Name:-</Text>
                    <Text style={styles.data}>Mahesh</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, width: '70%', justifyContent: 'space-around' }}>
                    <Text style={styles.header}>Test Profile:-</Text>
                    <Text style={styles.data}>Sr.Doctor</Text>
                </View>

            </View>

            <View style={{ alignItems: 'center' }}>

                {spo ? (<>

                    <TouchableOpacity onPress={spodata}>
                        <View style={{ marginTop: hp('4%'), backgroundColor: '#e6ecff', width: width * 0.9, borderRadius: 10 }}>
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('1%') }}>
                                <Text style={styles.header}>SPO2</Text>
                                <Text style={styles.data}>{spo}%</Text>

                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('1%'), marginBottom: 20 }}>
                                <Text style={styles.header}>BP</Text>
                                <Text style={styles.data}>{sdp}</Text>

                            </View>
                        </View>
                    </TouchableOpacity>



                </>) : (<>
                    <TouchableOpacity onPress={spodata}>
                        <View style={{ marginTop: hp('5%'), backgroundColor: '#e6ecff', width: width * 0.9, borderRadius: 10 }}>
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
                                        source={require("../../assets/78930-pulse-oximeter-power-on.json")} loop={true} autoPlay={true}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>


                </>)}


            </View>

            <Test_thermometer />
            <Test_bp />
            <Test_weight />

            <View>

                {/* //////////////////////////////////////////////////////////instructions */}

                <Modal
                    animationType="fade"
                    transparent
                    visible={instruction}


                    presentationStyle="overFullScreen"
                    onRequestClose={() => { setinstruction(false) }}
                    close={() => { setinstruction(false) }}

                // onBackdropPress={closeqr}
                // onRequestClose={() => { console.log("Modal has been closed.") }}


                >
                    <View style={styles.viewWrapper12}>
                        <View style={styles.modalView12}>
                            {/* <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: hp('1%'), padding: 10 }}>

                                <Text style={{ color: '#000', textAlign: 'center', justifyContent: 'center' }}>Covid 19 Ag  Test </Text>
                      
                            </View> */}
                            <View style={{ borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: hp("1%") }}>
                                <Text></Text>
                                <Text style={{ color: '#000' }}>Instructions </Text>
                                <TouchableOpacity onPress={() => { setinstruction(false) }}>
                                    <Image style={{ width: 25, height: 25, marginRight: 10 }} source={require('../../assets/remove.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <LottieView
                                    style={{
                                        width: width * 0.6,
                                        height: Dimensions.get("window").width * 0.5,
                                        justifyContent: 'center',
                                    }}
                                    source={require("../../assets/json/78935-measure-health_oximeter.json")} loop={true} autoPlay={true}
                                />

                                <View>
                                    <Text style={{ color: '#000', fontSize: 14 }}>1. Turn ON  oximeter</Text>
                                    <Text style={{ color: '#000', fontSize: 14 }}>2. Please  insert the Fingure proper Way</Text>
                                </View>

                                {/* <ScrollView> */}
                                {/* <FlatList
                                        data={list}
                                        renderItem={({ item }) => renderItem(item)}
                                        keyExtractor={item => item.id}
                                    /> */}
                                {/* </ScrollView> */}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('5%'), marginBottom: hp('5%') }}>

                                <View>
                                    <TouchableOpacity onPress={instructionok}>
                                        <View style={styles.btn12}>
                                            <Text style={{ color: '#fff' }}>
                                                OK
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>



                        </View>
                    </View>
                </Modal>

                {/* /////////////////////////////////////////////////////blutooth animation */}
                <Modal
                    animationType="fade"
                    transparent
                    visible={BoxVisible1}


                    presentationStyle="overFullScreen"
                    onRequestClose={() => { setBoxVisible1(false) }}
                    close={() => { setBoxVisible1(false) }}

                // onBackdropPress={closeqr}
                // onRequestClose={() => { console.log("Modal has been closed.") }}


                >
                    <View style={styles.viewWrapper12}>
                        <View style={styles.modalView12}>
                            {/* <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: hp('1%'), padding: 10 }}>

                                <Text style={{ color: '#000', textAlign: 'center', justifyContent: 'center' }}>Covid 19 Ag  Test </Text>
                      
                            </View> */}
                            <View style={{ borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: hp("1%") }}>
                                <Text></Text>
                                <Text style={{ color: '#000' }}>Searching... </Text>
                                <TouchableOpacity onPress={() => { setBoxVisible1(false) }}>
                                    <Image style={{ width: 25, height: 25, marginRight: 10 }} source={require('../../assets/remove.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <LottieView
                                    style={{
                                        width: width * 0.3,
                                        height: Dimensions.get("window").width * 0.3,
                                        justifyContent: 'center',
                                    }}
                                    source={require("../../assets/133061-bluetooth-loading.json")} loop={true} autoPlay={true}
                                />
                                {/* <ScrollView> */}
                                {/* <FlatList
                                        data={list}
                                        renderItem={({ item }) => renderItem(item)}
                                        keyExtractor={item => item.id}
                                    /> */}
                                {/* </ScrollView> */}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('5%'), marginBottom: hp('5%') }}>
                                {/* <View>
                                    <TouchableOpacity>
                                        <View style={styles.btn}>
                                            <Text style={{ color: '#fff' }}>
                                                Cancel
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity>
                                        <View style={styles.btn1}>
                                            <Text style={{ color: '#fff' }}>
                                                Save
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View> */}
                            </View>



                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

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
        fontSize: 17,
        fontWeight: '900',
        color: '#000'


    }
})