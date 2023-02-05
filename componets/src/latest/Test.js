import {

    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Button,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    Modal,
    Dimensions,
    TouchableOpacity,
    Image

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
import BleManager from '../BleManger';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function Test({ navigation }) {
    const [BoxVisible, setBoxVisible] = useState(false);
    const [BoxVisible1, setBoxVisible1] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
    var height = Dimensions.get("window").height;
    var width = Dimensions.get("window").width;

    const spodata = () => {
        setBoxVisible(true)
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
    const startScan = () => {
        setBoxVisible1(true)
        if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
    }

    const handleDisconnectedPeripheral = (data) => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + data.peripheral);
    }

    const handleUpdateValueForCharacteristic = (data) => {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    const retrieveConnected = () => {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
        });
    }

    const handleDiscoverPeripheral = (peripheral) => {
        console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
    }

    const testPeripheral = (peripheral) => {
        if (peripheral) {
            if (peripheral.connected) {
                BleManager.disconnect(peripheral.id);
            } else {
                BleManager.connect(peripheral.id).then(() => {
                    let p = peripherals.get(peripheral.id);
                    if (p) {
                        p.connected = true;
                        peripherals.set(peripheral.id, p);
                        setList(Array.from(peripherals.values()));
                    }
                    console.log('Connected to ' + peripheral.id);


                    setTimeout(() => {

                        /* Test read current RSSI value */
                        BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                            console.log('Retrieved peripheral services', peripheralData);
                            console.log("data1", peripheralData)
                            console.log(peripheralData.advertising.manufacturerData.bytes)
                            console.log(peripheralData.characteristics[0])
                            // console.log()
                            // console.log()
                            // console.log()



                            // let datahex = peripheralData.from(byteArray, function (byte) {
                            //     return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                            // }).join('');


                            var s = '0x';
                            peripheralData.characteristics.forEach(function (byte) {
                                s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
                            });
                            console.log(s, "s values")

                            // let s12 = 0xFFFFFFFF + s + 1;
                            let s12 = (s + 0x10000).toString(16).substr(-4).toUpperCase();
                            console.log(s12, "s12")


                            let hexa = s.toString(16).toUpperCase();
                            console.log(hexa, "hex")

                            console.log(decimalToHexString(27));
                            console.log(decimalToHexString(48.6));


                            console.log(datahex, "datahexxxxxxxxxxxxxx")
                            // dataStr = bytesToHexFun2(peripheralData);
                            let dataStr1 = datahex.toUpperCase();

                            console.log(dataStr1, datahex, "datastr")

                            if (datahex.startsWith("00A201010007")) {
                                var oxy = data[6] & 0xFF;
                                var bpm = data[7] & 0xFF;
                                var pp = data[8] & 0xFF;
                                var piv = pp * 10 / 100;

                                console.log(oxy, bpm, pp, piv, "data############")
                                //                    if (mStartTime != 0) {
                                //                        if (oxy > 0 && oxy != 127) {
                                //                            oxylist.add(oxy);
                                //                        }
                                //                        if (bpm > 0 && bpm != 255) {
                                //                            bpmlist.add(bpm);
                                //                        }
                                //                        if (piv > 0) {
                                //                            pilist.add(piv);
                                //                        }
                                //                    }

                                if (oxy > 0 && oxy != 127) {
                                    setOxyMaxMin(oxy);
                                    let data = spo2Text.setText(oxy + "");
                                    console.log(data)
                                }
                                if (bpm > 0 && bpm != 255) {
                                    setBpmMaxMin(bpm);
                                    let datbpm = bpmText.setText((bpm + ""));
                                    console.log(datbpm)
                                }
                                b = new BigDecimal(piv);
                                f1 = b.setScale(1, RoundingMode.HALF_UP).doubleValue();
                                if (f1 > 0) {
                                    setPiMaxMin(f1);
                                    piText.setText(f1 + "");
                                }
                            }



                            BleManager.readRSSI(peripheral.id).then((rssi) => {
                                console.log('Retrieved actual RSSI value', rssi);
                                let p = peripherals.get(peripheral.id);
                                if (p) {
                                    p.rssi = rssi;
                                    peripherals.set(peripheral.id, p);
                                    setList(Array.from(peripherals.values()));
                                }
                            });
                        });

                        // BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                        //     console.log("peripheralInfo", peripheralInfo);
                        //     const HEART_RATE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
                        //     const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';
                        //     startStreamingData = async (
                        //         emitter: (arg0: { payload: number | BleError }) => void,
                        //     ) => {
                        //         await this.device?.discoverAllServicesAndCharacteristics();
                        //         this.device?.monitorCharacteristicForService(
                        //             HEART_RATE_UUID,
                        //             HEART_RATE_CHARACTERISTIC,
                        //             (error, characteristic) =>
                        //                 this.onHeartRateUpdate(error, characteristic, emitter),
                        //         );
                        //     };
                        // })


                        // Test using bleno's pizza example
                        // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
                        /*
                        BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                          console.log(peripheralInfo);
                          var service = '13333333-3333-3333-3333-333333333337';
                          var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
                          var crustCharacteristic = '13333333-3333-3333-3333-333333330001';
            
                          setTimeout(() => {
                            BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                              console.log('Started notification on ' + peripheral.id);
                              setTimeout(() => {
                                BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                                  console.log('Writed NORMAL crust');
                                  BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                                    console.log('Writed 351 temperature, the pizza should be BAKED');
                                    
                                    //var PizzaBakeResult = {
                                    //  HALF_BAKED: 0,
                                    //  BAKED:      1,
                                    //  CRISPY:     2,
                                    //  BURNT:      3,
                                    //  ON_FIRE:    4
                                    //};
                                  });
                                });
            
                              }, 500);
                            }).catch((error) => {
                              console.log('Notification error', error);
                            });
                          }, 200);
                        });*/



                    }, 900);
                }).catch((error) => {
                    console.log('Connection error', error);
                });
            }
        }

    }

    useEffect(() => {
        BleManager.start({ showAlert: false });

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
        // const bleManager = new BleManager();
        // bleManager.onStateChange(state => {
        //     if (state !== "PoweredOn") return
        //     bleManager.startDeviceScan(
        //         ["053d03fd-00b0-4331-a337-f49f59777484"], // change this value to null to and all peripherals are called
        //         null,
        //         (error, scannedDevice) => {
        //             if (error) console.error(error);
        //             bleManager.connectToDevice(scannedDevice.id).then(connectedDevice => {
        //                 return connectedDevice.discoverAllServicesAndCharacteristics()
        //             }).then(connectedDevice2 => {
        //                 return connectedDevice2.services()
        //             }).then(services => {
        //                 console.log(services.map(x => x.uuid));
        //             })
        //         }
        //     )
        // })

        return (() => {
            console.log('unmount');
            bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
            bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
            bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
            bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        })


    }, []);
    const renderItem = (item) => {
        const color = item.connected ? 'green' : '#fff';
        { console.log("item#############", item) }
        return (
            <TouchableHighlight onPress={() => testPeripheral(item)}>
                <View style={[styles.row, { backgroundColor: color }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
                    <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );


    }

    return (
        <SafeAreaView style={styles.container}>
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
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={spodata}>
                    <View style={{ marginTop: hp('10%'), backgroundColor: '#e6ecff', width: width * 0.9, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', }}>
                                <Text style={{ color: '#000', fontSize: 20 }}>sp02</Text>
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
                                {/* <Image source={require()}/> */}

                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ///////////////////////////second */}
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={spodata1}>
                    <View style={{ marginTop: hp('3%'), backgroundColor: '#e6ecff', width: width * 0.9, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', }}>
                                <Text style={{ color: '#000', fontSize: 20 }}>Temparature</Text>
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
                                {/* <Image source={require()}/> */}

                            </View>
                        </View>
                    </View>

                </TouchableOpacity>
            </View>

            {/* //////////////third3 */}
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginTop: hp('2%'), backgroundColor: '#e6ecff', width: width * 0.9, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center', }}>
                            <Text style={{ color: '#000', fontSize: 20 }}>Weight</Text>
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
                            {/* <Image source={require()}/> */}

                        </View>
                    </View>
                </View>
            </View>





            <View>
                <Modal
                    animationType="fade"
                    transparent
                    visible={BoxVisible}


                    presentationStyle="overFullScreen"
                    onRequestClose={() => { setBoxVisible(false) }}
                    close={() => { setBoxVisible(false) }}

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
                                <Text style={{ color: '#000' }}>Covid 19 Ag Test </Text>
                                <TouchableOpacity onPress={closeqr}>
                                    <Image style={{ width: 25, height: 25, marginRight: 10 }} source={require('../../assets/remove.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {/* <Text>SP02</Text> */}

                                    {(list.length == 0) &&
                                        <View style={{ flex: 1, margin: 20 }}>
                                            <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                                        </View>
                                    }

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('2%') }}>
                                    <Text>Temparature</Text>
                                    <Text>NULL</Text>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('2%') }}>
                                    <Text>Test Date</Text>
                                    <Text>NULL</Text>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('2%') }}>
                                    <Text>Device</Text>
                                    <Text>NULL</Text>

                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('5%'), marginBottom: hp('5%') }}>
                                <View>
                                    <TouchableOpacity onPress={startScan}>
                                        <View style={styles.btn}>
                                            <Text style={{ color: '#fff' }}>
                                                Load
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

                                </View>
                            </View>



                        </View>
                    </View>
                </Modal>

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
                                <Text style={{ color: '#000' }}>Covid 19 Ag Test </Text>
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
                                <ScrollView>
                                    <FlatList
                                        data={list}
                                        renderItem={({ item }) => renderItem(item)}
                                        keyExtractor={item => item.id}
                                    />
                                </ScrollView>

                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('5%'), marginBottom: hp('5%') }}>
                                <View>
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

                                </View>
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
})