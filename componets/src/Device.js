import React, {
    useState,
    useEffect,
} from 'react';
import {
    SafeAreaView,
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
} from 'react-native';
import bleManager from 'react-native-ble-manager';
// import {
//     Colors,
// } from 'react-native/Libraries/NewAppScreen';

import BleManager from './BleManger';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const bleManager = new BleManagers();
const App = () => {
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);


    const startScan = () => {
        if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                setIsScanning(true);
                // connectToOximeter();

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
        console.log(peripheral, "per@@@@@@@@")

        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + data.peripheral);
    }

    const handleUpdateValueForCharacteristic = (data) => {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
        var serviceUUID = "cdeacb80-5235-4c07-8846-93a37ee6b86d"
        console.log(data.characteristic, "data.characteristic")

        var pluse = data.value[0]
        var sp02 = data.value[1]

        console.log(pluse, sp02, "sp02@@@@@@@@@@@@@@@@@@@@@@@@@")
        BleManager.read(data.peripheral, data.service, data.characteristic)
            .then(value => {
                console.log(value, "value@##########################################################")
                const pulse = value[0];
                const spo2 = value[1];

                console.log(spo2, pulse, "sp0222222222222222######################################################################")

                // this.setState({ pulse, spo2 });
            })
            .catch(error => {
                console.error(`Failed to read values from ${deviceId}:`, error);
            });

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
        console.log('Got ble peripheral@@@@@@@@@@@@@@@@', peripheral.name);



        if (peripheral) {

            if (peripheral.name === 'My Oximeter') {

                console.log("device accepted")
                const oximeter = peripheral;
                var serviceUUID = "cdeacb80-5235-4c07-8846-93a37ee6b86d"
                var characteristicUUID = "cdeacb81-5235-4c07-8846-93a37ee6b86d"

                BleManager.connect(oximeter.id)
                    .then((data) => {
                        console.log(data, "data@@")
                        console.log(`Connected to ${oximeter.name}`);

                        console.log(oximeter.id, "id@@@@@@@@@@@@@")

                        // this.setState({ connected: true, oximeter });
                        // subscribeToValues(oximeter.id);
                        var deviceId = oximeter.id
                        BleManager.startNotification(deviceId, serviceUUID, characteristicUUID)
                            // BleManager.startNotification(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
                            .then((value) => {
                                console.log(value, "valuessssssss@@@@@@@@@@")
                                console.log(`Subscribed to values of ${deviceId}`);
                            })
                            .catch(error => {
                                console.error(`Failed to subscribe to values of ${deviceId}:`, error);
                            });



                        BleManager.read(deviceId, serviceUUID, characteristicUUID)
                            .then((value) => {
                                console.log(value, "value@#@@@@@@@@@")
                                const pulse = value[0];
                                const spo2 = value[1];

                                console.log(spo2, pulse, "sp0222222222222222#######")

                                // this.setState({ pulse, spo2 });
                            })
                            .catch(error => {
                                console.error(`Failed to read values from ${deviceId}:`, error);
                            });
                    })
                    .catch(error => {
                        console.error(`Failed to connect to ${oximeter.name}:`, error);
                    });
            }
        }


        if (!peripheral.name) {
            peripheral.name = 'My Oximeter';
        }

        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));

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


    }, []);


    useEffect(() => {

    })


    const renderItem = (item) => {
        const color = item.connected ? 'green' : '#fff';
        // { console.log("item#############", item) }
        return (
            <TouchableHighlight>
                <View style={[styles.row, { backgroundColor: color }]}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
                    <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );


    }

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    {global.HermesInternal == null ? null : (
                        <View style={styles.engine}>
                            <Text style={styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
                    <View style={styles.body}>

                        <View style={{ margin: 10 }}>
                            <Button
                                title={' peripherals ?(' + (isScanning ? 'on' : 'off') + ')'}
                                onPress={() => startScan()}
                            />
                        </View>

                        <View style={{ margin: 10 }}>
                            <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
                        </View>

                        {(list.length == 0) &&
                            <View style={{ flex: 1, margin: 20 }}>
                                <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                            </View>
                        }

                    </View>
                </ScrollView>
                <FlatList
                    data={list}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={item => item.id}
                />


            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        // backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        // backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        // color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        // color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        // color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default App;


// import {
//     SafeAreaView,
//     StyleSheet,
//     View,
//     Text,
//     StatusBar,
//     NativeModules,
//     NativeEventEmitter,
//     Button,
//     Platform,
//     PermissionsAndroid,
//     FlatList,
//     TouchableHighlight,
// } from 'react-native';

// import { Colors } from 'react-native/Libraries/NewAppScreen';

// // import and setup react-native-ble-manager
// import BleManager from 'react-native-ble-manager';
// const BleManagerModule = NativeModules.BleManager;
// const bleEmitter = new NativeEventEmitter(BleManagerModule);

// // const BleManagerModule = NativeModules.BleManager;
// // const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// // import stringToBytes from convert-string package.
// // this func is useful for making string-to-bytes conversion easier
// import { stringToBytes } from 'convert-string';

// // import Buffer function.
// // this func is useful for making bytes-to-string conversion easier
// const Buffer = require('buffer/').Buffer;

// const App = () => {
//     const [isScanning, setIsScanning] = useState(false);
//     const [list, setList] = useState([]);
//     const peripherals = new Map();
//     const [testMode, setTestMode] = useState('read');

//     // start to scan peripherals
//     const startScan = () => {

//         // skip if scan process is currenly happening
//         if (isScanning) {
//             return;
//         }

//         // first, clear existing peripherals
//         peripherals.clear();
//         setList(Array.from(peripherals.values()));

//         // then re-scan it
//         BleManager.scan([], 3, true)
//             .then(() => {
//                 console.log('Scanning...');
//                 setIsScanning(true);
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     };

//     // handle discovered peripheral
//     const handleDiscoverPeripheral = (peripheral) => {
//         console.log('Got ble peripheral', peripheral);

//         if (!peripheral.name) {
//             peripheral.name = 'NO NAME';
//         }

//         peripherals.set(peripheral.id, peripheral);
//         setList(Array.from(peripherals.values()));
//     };

//     // handle stop scan event
//     const handleStopScan = () => {
//         console.log('Scan is stopped');
//         setIsScanning(false);
//     };

//     // handle disconnected peripheral
//     const handleDisconnectedPeripheral = (data) => {
//         console.log('Disconnected from ' + data.peripheral);

//         let peripheral = peripherals.get(data.peripheral);
//         if (peripheral) {
//             peripheral.connected = false;
//             peripherals.set(peripheral.id, peripheral);
//             setList(Array.from(peripherals.values()));
//         }
//     };

//     // handle update value for characteristic
//     const handleUpdateValueForCharacteristic = (data) => {
//         console.log(
//             'Received data from: ' + data.peripheral,
//             'Characteristic: ' + data.characteristic,
//             'Data: ' + data.value,
//         );
//     };

//     // retrieve connected peripherals.
//     // not currenly used
//     const retrieveConnectedPeripheral = () => {
//         BleManager.getConnectedPeripherals([]).then((results) => {
//             peripherals.clear();
//             setList(Array.from(peripherals.values()));

//             if (results.length === 0) {
//                 console.log('No connected peripherals');
//             }

//             for (var i = 0; i < results.length; i++) {
//                 var peripheral = results[i];
//                 peripheral.connected = true;
//                 peripherals.set(peripheral.id, peripheral);
//                 setList(Array.from(peripherals.values()));
//             }
//         });
//     };

//     // update stored peripherals
//     const updatePeripheral = (peripheral, callback) => {
//         let p = peripherals.get(peripheral.id);
//         if (!p) {
//             return;
//         }

//         p = callback(p);
//         peripherals.set(peripheral.id, p);
//         setList(Array.from(peripherals.values()));
//     };

//     // get advertised peripheral local name (if exists). default to peripheral name
//     const getPeripheralName = (item) => {
//         if (item.advertising) {
//             if (item.advertising.localName) {
//                 return item.advertising.localName;
//             }
//         }

//         return item.name;
//     };

//     // connect to peripheral then test the communication
//     const connectAndTestPeripheral = (peripheral) => {
//         if (!peripheral) {
//             return;
//         }

//         if (peripheral.connected) {
//             BleManager.disconnect(peripheral.id);
//             return;
//         }

//         // connect to selected peripheral
//         BleManager.connect(peripheral.id)
//             .then(() => {
//                 console.log('Connected to ' + peripheral.id, peripheral);

//                 // update connected attribute
//                 updatePeripheral(peripheral, (p) => {
//                     p.connected = true;
//                     return p;
//                 });

//                 // retrieve peripheral services info
//                 BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
//                     console.log('Retrieved peripheral services', peripheralInfo);

//                     // test read current peripheral RSSI value
//                     BleManager.readRSSI(peripheral.id).then((rssi) => {
//                         console.log('Retrieved actual RSSI value', rssi);

//                         // update rssi value
//                         updatePeripheral(peripheral, (p) => {
//                             p.rssi = rssi;
//                             return p;
//                         });
//                     });

//                     // test read and write data to peripheral
//                     const serviceUUID = '10000000-0000-0000-0000-000000000001';
//                     const charasteristicUUID = '20000000-0000-0000-0000-000000000001';

//                     console.log('peripheral id:', peripheral.id);
//                     console.log('service:', serviceUUID);
//                     console.log('characteristic:', charasteristicUUID);

//                     switch (testMode) {
//                         case 'write':
//                             // ===== test write data
//                             const payload = 'pizza';
//                             const payloadBytes = stringToBytes(payload);
//                             console.log('payload:', payload);

//                             BleManager.write(peripheral.id, serviceUUID, charasteristicUUID, payloadBytes)
//                                 .then((res) => {
//                                     console.log('write response', res);
//                                     alert(`your "${payload}" is stored to the food bank. Thank you!`);
//                                 })
//                                 .catch((error) => {
//                                     console.log('write err', error);
//                                 });
//                             break;

//                         case 'read':
//                             // ===== test read data
//                             BleManager.read(peripheral.id, serviceUUID, charasteristicUUID)
//                                 .then((res) => {
//                                     console.log('read response', res);
//                                     if (res) {
//                                         const buffer = Buffer.from(res);
//                                         const data = buffer.toString();
//                                         console.log('data', data);
//                                         alert(`you have stored food "${data}"`);
//                                     }
//                                 })
//                                 .catch((error) => {
//                                     console.log('read err', error);
//                                     alert(error);
//                                 });
//                             break;

//                         case 'notify':
//                             // ===== test subscribe notification
//                             BleManager.startNotification(peripheral.id, serviceUUID, charasteristicUUID)
//                                 .then((res) => {
//                                     console.log('start notification response', res);
//                                 });
//                             break;

//                         default:
//                             break;
//                     }
//                 });
//             })
//             .catch((error) => {
//                 console.log('Connection error', error);
//             });
//     };

//     // mount and onmount event handler
//     useEffect(() => {
//         console.log('Mount');

//         // initialize BLE modules
//         BleManager.start({ showAlert: false });

//         // add ble listeners on mount
//         bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
//         bleEmitter.addListener('BleManagerStopScan', handleStopScan);
//         bleEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
//         bleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

//         // check location permission only for android device
//         if (Platform.OS === 'android' && Platform.Version >= 23) {
//             PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r1) => {
//                 if (r1) {
//                     console.log('Permission is OK');
//                     return;
//                 }

//                 PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r2) => {
//                     if (r2) {
//                         console.log('User accept');
//                         return
//                     }

//                     console.log('User refuse');
//                 });
//             });
//         }

//         // remove ble listeners on unmount
//         return () => {
//             console.log('Unmount');

//             bleEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
//             bleEmitter.removeListener('BleManagerStopScan', handleStopScan);
//             bleEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
//             bleEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
//         };
//     }, []);

//     // render list of devices
//     const renderItem = (item) => {
//         const color = item.connected ? 'green' : '#fff';
//         return (
//             <TouchableHighlight onPress={() => connectAndTestPeripheral(item)}>
//                 <View style={[styles.row, { backgroundColor: color }]}>
//                     <Text
//                         style={{
//                             fontSize: 12,
//                             textAlign: 'center',
//                             color: '#333333',
//                             padding: 10,
//                         }}>
//                         {getPeripheralName(item)}
//                     </Text>
//                     <Text
//                         style={{
//                             fontSize: 10,
//                             textAlign: 'center',
//                             color: '#333333',
//                             padding: 2,
//                         }}>
//                         RSSI: {item.rssi}
//                     </Text>
//                     <Text
//                         style={{
//                             fontSize: 8,
//                             textAlign: 'center',
//                             color: '#333333',
//                             padding: 2,
//                             paddingBottom: 20,
//                         }}>
//                         {item.id}
//                     </Text>
//                 </View>
//             </TouchableHighlight>
//         );
//     };

//     return (
//         <>
//             <StatusBar barStyle="dark-content" />
//             <SafeAreaView style={styles.safeAreaView}>
//                 {/* header */}
//                 <View style={styles.body}>
//                     <View style={styles.scanButton}>
//                         <Button
//                             title={'Scan Bluetooth Devices'}
//                             onPress={() => startScan()}
//                         />
//                     </View>

//                     {list.length === 0 && (
//                         <View style={styles.noPeripherals}>
//                             <Text style={styles.noPeripheralsText}>No peripherals</Text>
//                         </View>
//                     )}
//                 </View>

//                 {/* ble devices */}
//                 <FlatList
//                     data={list}
//                     renderItem={({ item }) => renderItem(item)}
//                     keyExtractor={(item) => item.id}
//                 />

//                 {/* bottom footer */}
//                 <View style={styles.footer}>
//                     <TouchableHighlight onPress={() => setTestMode('write')}>
//                         <View style={[styles.row, styles.footerButton]}>
//                             <Text>Store pizza</Text>
//                         </View>
//                     </TouchableHighlight>
//                     <TouchableHighlight onPress={() => setTestMode('read')}>
//                         <View style={[styles.row, styles.footerButton]}>
//                             <Text>Get stored food</Text>
//                         </View>
//                     </TouchableHighlight>
//                 </View>
//             </SafeAreaView>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     safeAreaView: {
//         flex: 1,
//     },
//     body: {
//         backgroundColor: Colors.white,
//     },
//     scanButton: {
//         margin: 10,
//     },
//     noPeripherals: {
//         flex: 1,
//         margin: 20,
//     },
//     noPeripheralsText: {
//         textAlign: 'center',
//     },
//     footer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',
//         marginBottom: 30,
//     },
//     footerButton: {
//         alignSelf: 'stretch',
//         padding: 10,
//         backgroundColor: 'grey',
//     },
// });

// export default App;