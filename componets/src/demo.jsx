/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
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
} from 'react-native';
import Buffer from 'buffer'

import { Colors } from 'react-native/Libraries/NewAppScreen';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = false;

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(new Map());
    const [spo, setspo] = useState('')
    const [sdp, setsbp] = useState('')
    const theme = useColorScheme();

    console.log({ peripherals: peripherals.entries() });

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


        // const newbuffer = Buffer.form(data.value)
        // console.log("new buffer@", newbuffer)
        // const year = newbuffer.readUInt16LE(0)
        // console.log("yearssssss", year)
        const incomingPacket = data.value
        // const buffer = Buffer.from(data); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
        // const sensorData = incomingPacket.readUInt8(1, true)
        // const sensorData1 = incomingPacket.readUInt16LE(1, true)
        // const sensorData2 = incomingPacket.readUInt16BE(1, true)
        // const sensorData3 = incomingPacket.readUInt8(2)
        // const sensorData4 = incomingPacket.readUInt8(4)
        // const sensorData5 = incomingPacket.readUInt8(5)
        // const sensorData6 = incomingPacket.readUInt8(6)
        const buffer01 = new ArrayBuffer(16);
        const bytes = new Uint8Array(data.value);
        const pulse = new DataView(bytes.buffer).getUint16(buffer01, 3, true)
        // const battery = new Uint8Array(bytes.buffer)[14];
        console.log('Pulse Rate--------------:' + pulse);
        // console.log('Battery Leve:' + battery);

        // var oxy = data.value[6] & 0xFF;
        // var bpm = data.value[7] & 0xFF;
        // var pp = data.value[8] & 0xFF;
        // var piv = pp * 10 / 100;

        if (data.value.length == 4) {
            setspo(data.value[2])
            console.log("sppo222222222222222@!--------", data.value[2])
            setsbp(data.value[1])
            console.log("bp--------", sdp)


        }

        // console.log("oxy", oxy, "bpm ", bpm, "pp", pp, "piv", piv)

        // for (byte b : bytes) { // 利用位运算进行转换，可以看作方法一的变种
        //     buf[index++] = HEX_CHAR[b >>> 4 & 0xf];
        //     buf[index++] = HEX_CHAR[b & 0xf];
        // }


        // console.log("Data@1-------", sensorData, "01", sensorData1, "02", sensorData2, "03", sensorData3, "04", sensorData4, "05", sensorData5, "06", sensorData6)
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
                // console.log("Read-------------: " + readData);
                // const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                // const sensorData = buffer.readUInt8(1, true);

                // console.log("bufferrrrrrrrrrrrrr-", buffer)
                console.log(sensorData, "semesordata")

            })
            .catch((error) => {
                // Failure code
                console.log(error);
            });
        // console.log("buffer-----", buffer)
        // console.log("sensor dtaa---", sensorData)

        // const dataView = new DataView(new Uint8Array(incomingPacket).buffer);
        // console.log("dataview", dataView)
        // const spo2Value = dataView.getFloat32(0, true);
        // console.log(spo2Value);

        // // we are shifting the first byte left by 8 bits (size of one full byte) and adding to the unshifted remaining byte
        // const incomingPacketDecoded = incomingPacket[0] << 8 + incomingPacket[1]

        // console.log("incominng valuessssss", incomingPacketDecoded) // 14537


        // const incomingPacketDecoded01 = incomingPacket.map(i => String.fromCharCode(i)).join()

        // console.log("incomingPacketDecoded01", incomingPacketDecoded01)

        // const dataView = new DataView(new Uint8Array(data.value).buffer);
        // const integers = [];
        // for (let i = 0; i < dataView.byteLength; i += 2) {
        //     integers.push(dataView.getInt16(i, true));
        // }
        // console.log("@@@@@@@@@@@@@@@@@@@@@@", integers);


    };

    const handleDiscoverPeripheral = peripheral => {
        console.log('Got ble peripheral', peripheral);
        if (peripheral.name == "My Oximeter") {
            console.log("oxometer is identified---")


            // this.setState({ device: device });
            BleManager.connect(peripheral.id)
                .then(() => {
                    console.log('Connected');
                    BleManager.retrieveServices(peripheral.id)
                        .then((peripheralInfo) => {
                            console.log("periphal data011", peripheralInfo);
                            console.log("uuuid", peripheralInfo.advertising.serviceUUIDs[0])
                            // handleUpdateValueForCharacteristic()
                            // console.log("characteristic",peripheralInfo.map(()))
                            // peripheralInfo.characteristics.map((res) => {
                            //     console.log("charastics", res.characteristic)

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

                                    // setFileLength(length);
                                    // setF
                                    // this.setState({ value: readData });
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

    const renderItem = ({ item }) => {
        const backgroundColor = item.connected ? "#069400" : Colors.white;
        return (
            <TouchableHighlight underlayColor='#0082FC' onPress={() => togglePeripheralConnection(item)}>
                <View style={[styles.row, { backgroundColor }]}>
                    <Text style={styles.peripheralName}>
                        {item.name} {item.connecting && 'Connecting...'}
                    </Text>
                    <Text style={styles.rssi}>RSSI: {item.rssi}</Text>

                    <Text style={styles.peripheralId}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.body}>
                <Pressable style={styles.scanButton} onPress={startScan}>
                    <Text style={styles.scanButtonText}>
                        {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
                    </Text>
                </Pressable>


                <View>
                    <Text style={styles.noPeripherals}>{spo}</Text>
                </View>
                <View>
                    <Text style={styles.noPeripherals}>{sdp}</Text>
                </View>
                {Array.from(peripherals.values()).length == 0 && (
                    <View style={styles.row}>
                        <Text style={styles.noPeripherals}>No Peripherals, press "Scan Bluetooth" above</Text>
                    </View>
                )}
                <FlatList
                    data={Array.from(peripherals.values())}
                    contentContainerStyle={{ rowGap: 12 }}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </>
    );
};

const boxShadow = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
}


const styles = StyleSheet.create({
    engine: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        color: Colors.black,
    },
    scanButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: "#0a398a",
        margin: 10,
        borderRadius: 12,
        ...boxShadow

    },
    scanButtonText: {
        fontSize: 20,
        letterSpacing: 0.25,
        color: Colors.white,
    },
    body: {
        backgroundColor: '#0082FC',
        flex: 1,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    peripheralName: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
    },
    rssi: {
        fontSize: 12,
        textAlign: 'center',
        padding: 2,
    },
    peripheralId: {
        fontSize: 12,
        textAlign: 'center',
        padding: 2,
        paddingBottom: 20,
    },
    row: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        ...boxShadow
    },
    noPeripherals: {
        margin: 10,
        textAlign: 'center',
        color: Colors.white
    },
});


export default App;