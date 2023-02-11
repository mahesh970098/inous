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

    // const connectToOximeter = () => {
    //     // const { devices } = this.state;
    //     var devices = []
    //     console.log(devices, "devices")


    //     if (devices) {
    //         const oximeter = devices.find(device => device.name === 'oximeter');

    //         if (oximeter) {
    //             BleManager.connect(oximeter.id)
    //                 .then(() => {
    //                     console.log(`Connected to ${oximeter.name}`);

    //                     // this.setState({ connected: true, oximeter });
    //                     subscribeToValues(oximeter.id);
    //                 })
    //                 .catch(error => {
    //                     console.error(`Failed to connect to ${oximeter.name}:`, error);
    //                 });
    //         }
    //     }
    // };

    // const subscribeToValues = (deviceId) => {
    //     BleManager.startNotification(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
    //         .then(() => {
    //             console.log(`Subscribed to values of ${deviceId}`);
    //         })
    //         .catch(error => {
    //             console.error(`Failed to subscribe to values of ${deviceId}:`, error);
    //         });

    //     BleManager.read(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
    //         .then(value => {
    //             const pulse = value[0];
    //             const spo2 = value[1];

    //             console.log(spo2, pulse, "sp0222222222222222")

    //             // this.setState({ pulse, spo2 });
    //         })
    //         .catch(error => {
    //             console.error(`Failed to read values from ${deviceId}:`, error);
    //         });
    // };
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

                // const peripheralInfo = await BleManager.retrieveServices(deviceId);
                // const services = peripheralInfo.services;
                // for (const service of services) {
                //     const characteristics = service.characteristics;
                //     for (const characteristic of characteristics) {
                //         console.log(`Characteristic: ${characteristic.uuid}`);
                //         if (characteristic.uuid === PULSE_CHARACTERISTIC_UUID) {
                //             console.log('Found pulse characteristic');
                //             // Do something with the pulse characteristic...
                //         }
                //     }
                // }

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

    // const testPeripheral = async (peripheral) => {
    //     if (peripheral) {
    //         if (peripheral.connected) {
    //             BleManager.disconnect(peripheral.id);
    //         } else {
    //             BleManager.connect(peripheral.id).then(() => {
    //                 let p = peripherals.get(peripheral.id);
    //                 if (p) {
    //                     p.connected = true;
    //                     peripherals.set(peripheral.id, p);
    //                     setList(Array.from(peripherals.values()));
    //                 }
    //                 // console.log('Connected to ' + peripheral.id);


    //                 setTimeout(async () => {

    //                     /* Test read current RSSI value */
    //                     BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
    //                         console.log('Retrieved peripheral services', peripheralData);

    //                         console.log("data1", peripheralData)
    //                         // console.log(peripheralData.advertising.manufacturerData.bytes)
    //                         // console.log(peripheralData.characteristics[0])
    //                         // console.log()
    //                         // console.log()
    //                         // console.log()

    //                         const pulseOximeterCharacteristic = peripheralData.find(service => {
    //                             return service.uuid === 'cdeacb80-5235-4c07-8846-93a37ee6b86d';
    //                         });

    //                         // Read the pulse oximeter data
    //                         const data = BleManager.read(peripheral, pulseOximeterCharacteristic.service, pulseOximeterCharacteristic.characteristic);
    //                         console.log("dara@@@@@@", data)


    //                         // var st = '0x';
    //                         // peripheralData.characteristics.forEach(function (byte) {
    //                         //     var data = st += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    //                         //     console.log(data, "s data")

    //                         // });
    //                         // var s = '0x';
    //                         // peripheralData.characteristics.forEach(function (byte) {
    //                         //     return s += ('0' + (byte & 0xFF).toString(16)).slice(-2);

    //                         // });
    //                         // console.log(s, "s values")

    //                         // // let s12 = 0xFFFFFFFF + s + 1;
    //                         // let s12 = (s + 0x10000).toString(16).substr(-4).toUpperCase();
    //                         // console.log(s12, "s12")


    //                         // let hexa = s.toString(16).toUpperCase();
    //                         // console.log(hexa, "hex")

    //                         // // console.log(decimalToHexString(27));
    //                         // // console.log(decimalToHexString(48.6));


    //                         // console.log(datahex, "datahexxxxxxxxxxxxxx")
    //                         // // dataStr = bytesToHexFun2(peripheralData);
    //                         // let dataStr1 = datahex.toUpperCase();

    //                         // console.log(dataStr1, datahex, "datastr")

    //                         // if (datahex.startsWith("cdeacb80-5235-4c07-8846-93a37ee6b86d")) {
    //                         //     var oxy = data[6] & 0xFF;
    //                         //     var bpm = data[7] & 0xFF;
    //                         //     var pp = data[8] & 0xFF;
    //                         //     var piv = pp * 10 / 100;

    //                         //     console.log(oxy, bpm, pp, piv, "data############")
    //                         //     //                    if (mStartTime != 0) {
    //                         //     //                        if (oxy > 0 && oxy != 127) {
    //                         //     //                            oxylist.add(oxy);
    //                         //     //                        }
    //                         //     //                        if (bpm > 0 && bpm != 255) {
    //                         //     //                            bpmlist.add(bpm);
    //                         //     //                        }
    //                         //     //                        if (piv > 0) {
    //                         //     //                            pilist.add(piv);
    //                         //     //                        }
    //                         //     //                    }

    //                         //     if (oxy > 0 && oxy != 127) {
    //                         //         setOxyMaxMin(oxy);
    //                         //         let data = spo2Text.setText(oxy + "");
    //                         //         console.log(data)
    //                         //     }
    //                         //     if (bpm > 0 && bpm != 255) {
    //                         //         setBpmMaxMin(bpm);
    //                         //         let datbpm = bpmText.setText((bpm + ""));
    //                         //         console.log(datbpm)
    //                         //     }
    //                         //     b = new BigDecimal(piv);
    //                         //     f1 = b.setScale(1, RoundingMode.HALF_UP).doubleValue();
    //                         //     if (f1 > 0) {
    //                         //         setPiMaxMin(f1);
    //                         //         piText.setText(f1 + "");
    //                         //     }
    //                         // }



    //                         BleManager.readRSSI(peripheral.id).then((rssi) => {
    //                             console.log('Retrieved actual RSSI value', rssi);
    //                             let p = peripherals.get(peripheral.id);
    //                             if (p) {
    //                                 p.rssi = rssi;
    //                                 peripherals.set(peripheral.id, p);
    //                                 setList(Array.from(peripherals.values()));
    //                             }
    //                         });
    //                     });

    //                     BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
    //                         console.log("peripheralInfo", peripheralInfo);
    //                         const HEART_RATE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
    //                         const HEART_RATE_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';
    //                         startStreamingData = async (
    //                             emitter: (arg0: { payload: number | BleError }) => void,
    //                         ) => {
    //                             await this.device?.discoverAllServicesAndCharacteristics();
    //                             this.device?.monitorCharacteristicForService(
    //                                 HEART_RATE_UUID,
    //                                 HEART_RATE_CHARACTERISTIC,
    //                                 (error, characteristic) =>
    //                                     this.onHeartRateUpdate(error, characteristic, emitter),
    //                             );
    //                         };
    //                     })


    //                     // Test using bleno's pizza example
    //                     // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
    //                     /*
    //                     BleManager.retrieveServices(peripheralData).then((peripheralInfo) => {
    //                       console.log(peripheralInfo);
    //                       var service = '13333333-3333-3333-3333-333333333337';
    //                       var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
    //                       var crustCharacteristic = '13333333-3333-3333-3333-333333330001';

    //                       setTimeout(() => {
    //                         BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
    //                           console.log('Started notification on ' + peripheral.id);
    //                           setTimeout(() => {
    //                             BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
    //                               console.log('Writed NORMAL crust');
    //                               BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
    //                                 console.log('Writed 351 temperature, the pizza should be BAKED');

    //                                 //var PizzaBakeResult = {
    //                                 //  HALF_BAKED: 0,
    //                                 //  BAKED:      1,
    //                                 //  CRISPY:     2,
    //                                 //  BURNT:      3,
    //                                 //  ON_FIRE:    4
    //                                 //};
    //                               });
    //                             });

    //                           }, 500);
    //                         }).catch((error) => {
    //                           console.log('Notification error', error);
    //                         });
    //                       }, 200);
    //                     });*/



    //                 }, 900);
    //             }).catch((error) => {
    //                 console.log('Connection error', error);
    //             });
    //         }
    //     }

    // }

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

        // return (() => {
        //     console.log('unmount');
        //     bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        //     bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
        //     bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        //     bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        // })





    }, []);


    useEffect(() => {

    })
    // async function startScanning() {
    //     console.log('Scanning for devices...');

    //     try {
    //         await bleManager.startDeviceScan(null, null, (error, device) => {
    //             if (error) {
    //                 console.log('Error while scanning: ', error);
    //                 return;
    //             }

    //             if (device.name === 'YourOximeterName') {
    //                 console.log('Found device: ', device.name);
    //                 bleManager.stopDeviceScan();
    //                 connectToDevice(device);
    //             }
    //         });
    //     } catch (error) {
    //         console.log('Error while scanning: ', error);
    //     }
    // }

    // async function connectToDevice(device) {
    //     console.log('Connecting to device...');

    //     try {
    //         const connectedDevice = await bleManager.connectToDevice(device.id);
    //         console.log('Connected to device: ', connectedDevice.name);
    //         retrieveData(connectedDevice);
    //     } catch (error) {
    //         console.log('Error while connecting: ', error);
    //     }
    // }

    // async function retrieveData(device) {
    //     console.log('Retrieving data...');

    //     try {
    //         await device.discoverAllServicesAndCharacteristics();
    //         const data = await device.readCharacteristicForService('cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb80-5235-4c07-8846-93a37ee6b86d');
    //         console.log('Data: ', data);
    //     } catch (error) {
    //         console.log('Error while retrieving data: ', error);
    //     }
    // }

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


// import React, { useState, useEffect } from 'react';
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