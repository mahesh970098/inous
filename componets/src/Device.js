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

// import {
//     Colors,
// } from 'react-native/Libraries/NewAppScreen';

import BleManager from './BleManger';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);


    const startScan = () => {
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
                                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
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