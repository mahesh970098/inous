// // import React, { Component } from 'react';
// // import { View, Text } from 'react-native';
// // import BleManager from 'react-native-ble-manager';

// // export default class OximeterExample extends Component {
// //     state = {
// //         device: null,
// //         values: null,
// //     };

// //     componentDidMount() {
// //         BleManager.start({ showAlert: false });

// //         this.startScan();
// //     }

// //     startScan = () => {
// //         BleManager.scan([], 30, true)
// //             .then(results => {
// //                 console.log(results, "resulyts")
// //                 // Filter the results to find the oximeter device
// //                 const device = results.find(d => d.name === 'My Oximeter');


// //                 if (!device) {
// //                     throw new Error('Oximeter device not found');
// //                 }

// //                 this.setState({ device }, () => {
// //                     this.connect();
// //                 });
// //             })
// //             .catch(error => {
// //                 console.error(error);
// //             });
// //         //         BleManager.scan([], 30, true)
// //         //   .then(results => {
// //         //     console.log('Scan results:', results);
// //         //   })
// //         //   .catch(error => {
// //         //     console.error('Error while scanning:', error);
// //         //   });
// //     };

// //     connect = () => {
// //         const { device } = this.state;

// //         BleManager.connect(device.id)
// //             .then(() => {
// //                 this.readValues();
// //             })
// //             .catch(error => {
// //                 console.error(error);
// //             });
// //     };

// //     readValues = () => {
// //         const { device } = this.state;
// // // const characteristicUUID = '00002a37-0000-1000-8000-00805f9b34fb';
// // const characteristicUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'

// //         BleManager.read(device.id, characteristicUUID)
// //             .then(data => {
// //                 // Extract the values from the data
// //                 const values = this.extractValues(data);

// //                 this.setState({ values });
// //             })
// //             .catch(error => {
// //                 console.error(error);
// //             });
// //     };

// //     extractValues = data => {
// //         // Your implementation to extract the values from the data
// //         // ...

// //         return {
// //             // Example values
// //             pulse: 72,
// //             saturation: 96,
// //         };
// //     };

// //     render() {
// //         const { values } = this.state;

// //         return (
// //             <View>
// //                 {values ? (
// //                     <View>
// //                         <Text>Pulse: {values.pulse}</Text>
// //                         <Text>Saturation: {values.saturation}</Text>
// //                     </View>
// //                 ) : (
// //                     <Text>Scanning for oximeter device...</Text>
// //                 )}
// //             </View>
// //         );
// //     }
// // }

// import React, { Component } from 'react';
// import { View, Text, PermissionsAndroid } from 'react-native';
// import BleManager from 'react-native-ble-manager';

// export default class OximeterExample extends Component {
//     state = {
//         values: null,
//         devices: [],
//         oximeter: null,
//         connected: false,
//         pulse: 0,
//         spo2: 0,
//     };

//     componentDidMount() {
//         this.requestBluetoothPermission();
//         BleManager.start({ showAlert: false });

//         this.startScan();

//         this.scanForOximeter()
//     }

//     requestBluetoothPermission = async () => {
//         try {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//                 {
//                     title: 'Bluetooth Permission',
//                     message: 'This app requires access to Bluetooth',
//                 }
//             );

//             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                 BleManager.start({ showAlert: false });

//                 this.startScan();
//             } else {
//                 console.error('Bluetooth permission denied');
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     startScan = () => {
//         console.log("scaned clicked")

//         // BleManager.scan([], 3, true).then((results) => {
//         //     console.log('Scanning...');
//         //     setIsScanning(true);
//         // }).catch(err => {
//         //     console.error(err);
//         // });
//         BleManager.scan([], 30, true)
//             .then(results => {
//                 console.log(results, "results")
//                 this.setState({ devices: results });

//                 this.connectToOximeter();
//             })
//             .catch(error => {
//                 console.error('Error while scanning:', error);
//             });
//     };

//     connectToOximeter = () => {
//         const { devices } = this.state;
//         console.log(devices, "devices")


//         if (devices) {
//             const oximeter = devices.find(device => device.name === 'oximeter');

//             if (oximeter) {
//                 BleManager.connect(oximeter.id)
//                     .then(() => {
//                         console.log(`Connected to ${oximeter.name}`);

//                         this.setState({ connected: true, oximeter });
//                         this.subscribeToValues(oximeter.id);
//                     })
//                     .catch(error => {
//                         console.error(`Failed to connect to ${oximeter.name}:`, error);
//                     });
//             }
//         }
//     };

//     subscribeToValues = deviceId => {
//         BleManager.startNotification(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
//             .then(() => {
//                 console.log(`Subscribed to values of ${deviceId}`);
//             })
//             .catch(error => {
//                 console.error(`Failed to subscribe to values of ${deviceId}:`, error);
//             });

//         BleManager.read(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
//             .then(value => {
//                 const pulse = value[0];
//                 const spo2 = value[1];

//                 this.setState({ pulse, spo2 });
//             })
//             .catch(error => {
//                 console.error(`Failed to read values from ${deviceId}:`, error);
//             });
//     };



//     scanForOximeter = async () => {
//         var OXIMETER_SERVICE_UUID = 'cdeacb80-5235-4c07-8846-93a37ee6b86d'
//         var PULSE_CHARACTERISTIC_UUID = 'cdeacb81-5235-4c07-8846-93a37ee6b86d'
//         try {
//             // Scan for devices
//             const devices = await BleManager.scan([OXIMETER_SERVICE_UUID], 5, true);
//             // Find the oximeter device
//             const oximeterDevice = devices.find(device => device.name === 'MyOximeter');
//             if (!oximeterDevice) {
//                 setError('Oximeter not found');
//                 return;
//             }

//             // Connect to the oximeter device
//             await BleManager.connect(oximeterDevice.id);
//             // Retrieve the services and characteristics of the oximeter device
//             const peripheralInfo = await BleManager.retrieveServices(oximeterDevice.id);
//             // Find the pulse characteristic
//             const pulseCharacteristic = peripheralInfo.characteristics.find(characteristic => characteristic.uuid === PULSE_CHARACTERISTIC_UUID);
//             if (!pulseCharacteristic) {
//                 setError('Pulse characteristic not found');
//                 return;
//             }

//             // Read the pulse characteristic
//             const data = await BleManager.read(oximeterDevice.id, OXIMETER_SERVICE_UUID, PULSE_CHARACTERISTIC_UUID);
//             // Parse the pulse value from the data buffer
//             const pulseValue = parsePulseValue(data);
//             // Update the state with the pulse value
//             setPulse(pulseValue);
//         } catch (error) {
//             // Handle any errors
//             setError(`Error while reading pulse: ${error.message}`);
//         }
//     };
//     render() {

//         const { connected, pulse, spo2, values } = this.state;

//         return (
//             <View>
//                 {values ? (
//                     <View>
//                         <Text>Pulse: {values.pulse}</Text>
//                         <Text>Saturation: {values.saturation}</Text>
//                     </View>
//                 ) : (
//                     <Text>Scanning for oximeter device...</Text>
//                 )}

//                 <View>
//                     <Text>{connected ? 'Connected' : 'Not Connected'}</Text>
//                     <Text>Pulse: {pulse}</Text>
//                     <Text>SpO2: {spo2}</Text>
//                 </View>
//             </View>
//         );
//     }
// }


// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import BleManager from 'react-native-ble-manager';

// const Oximeter = () => {
//     const [peripherals, setPeripherals] = useState(new Map());
//     const [connectedDevice, setConnectedDevice] = useState(null);
//     const [pulse, setPulse] = useState(0);
//     const [oxygen, setOxygen] = useState(0);

//     const SERVICE_UUID = 'some-service-uuid';
//     const CHARACTERISTIC_UUID = 'some-characteristic-uuid';

//     useEffect(() => {
//         BleManager.start({ showAlert: false });
//         BleManager.enableBluetooth()
//             .then(() => console.log('Bluetooth is enabled'))
//             .catch((error) => console.log('Error enabling Bluetooth:', error));
//     }, []);

//     const startScan = () => {
//         BleManager.scan([], 5, true)
//             .then(() => console.log('Scan started'))
//             .catch((error) => console.log('Error starting scan:', error));
//     };

//     const handleStopScan = () => {
//         console.log('Scan stopped');
//     };

//     const handleDiscoverPeripheral = (peripheral) => {
//         console.log('Discovered peripheral:', peripheral);
//         const peripheralsCopy = new Map(peripherals);
//         peripheralsCopy.set(peripheral.id, peripheral);
//         setPeripherals(peripheralsCopy);
//     };

//     const connectToDevice = (peripheralId) => {
//         BleManager.connect(peripheralId)
//             .then(() => {
//                 console.log('Connected to device:', peripheralId);
//                 setConnectedDevice(peripheralId);
//                 BleManager.retrieveServices(peripheralId)
//                     .then((peripheralInfo) => {
//                         console.log('Retrieved peripheral info:', peripheralInfo);
//                         BleManager.startNotification(
//                             peripheralId,
//                             SERVICE_UUID,
//                             CHARACTERISTIC_UUID,
//                         )
//                             .then(() => console.log('Started notifications'))
//                             .catch((error) => console.log('Error starting notifications:', error));
//                     })
//                     .catch((error) => console.log('Error retrieving peripheral info:', error));
//             })
//             .catch((error) => console.log('Error connecting to device:', error));
//     };

//     const handleDisconnectedPeripheral = (data) => {
//         console.log('Disconnected from peripheral:', data);
//         setConnectedDevice(null);
//     };

//     const handleUpdateValueForCharacteristic = (data) => {
//         console.log('Received data from characteristic:', data);
//         const parsedData = new Uint8Array(data.value);
//         setPulse(parsedData[0]);
//         setOxygen(parsedData[1]);
//     };

//     useEffect(() => {
//         BleManager.start({ showAlert: false });
//         BleManager.enableBluetooth()
//             .then(() => {
//                 console.log('Bluetooth is enabled');
//                 BleManager.setLogLevel('verbose');
//                 BleManager.start({ showAlert: false });
//             })
//             .catch((error) => console.log('Error enabling Bluetooth:', error));

//         const handlerDiscover = BleManager.onStateChange((state) => {
//             if (state === 'PoweredOn') {
//                 startScan();
//                 handlerDiscover.remove();
//             }
//         });

//         const handlerStop = BleManager.onStopScan(handleStopScan);

//         const handlerConnect = BleManager.onConnect((peripheral) => {
//             console.log('Connected to peripheral:', peripheral);
//             setConnectedDevice(peripheral.id);
//         });

//         const handlerDisconnect = BleManager.onDisconnect(handleDisconnectedPeripheral);

//         const handlerUpdateValue = BleManager.onUpdateValueForCharacteristic(handleUpdateValueForCharacteristic);

//     },[])


import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import BleManager from 'react-native-ble-manager';

const Oximeter = () => {
    const [device, setDevice] = useState(null);
    const [connected, setConnected] = useState(false);
    const [pulse, setPulse] = useState(null);
    const [oxygen, setOxygen] = useState(null);

    const SERVICE_UUID = '00001822-0000-1000-8000-00805f9b34fb';
    const CHARACTERISTIC_UUID = '00002a5e-0000-1000-8000-00805f9b34fb';

    useEffect(() => {
        BleManager.start({ showAlert: false });
        return () => {
            BleManager.stopScan();
        };
    }, []);

    const scanForDevices = () => {
        BleManager.scan([], 5, true)
            .then(results => {
                console.log(results, "results")
                for (let i = 0; i < results.length; i++) {
                    const deviceName = results[i].name || '';
                    if (deviceName.indexOf('Oximeter') >= 0) {
                        setDevice(results[i]);
                        BleManager.stopScan();
                        break;
                    }
                }
            })
            .catch(error => console.log('Scan error:', error));
    };

    const connectToDevice = () => {
        BleManager.connect(device.id)
            .then(() => {
                console.log('Connected to device');
                setConnected(true);
                BleManager.startNotification(device.id, SERVICE_UUID, CHARACTERISTIC_UUID)
                    .then(() => console.log('Notification started'))
                    .catch(error => console.log('Notification error:', error));
            })
            .catch(error => console.log('Connection error:', error));
    };

    const disconnectFromDevice = () => {
        BleManager.disconnect(device.id)
            .then(() => {
                console.log('Disconnected from device');
                setConnected(false);
            })
            .catch(error => console.log('Disconnection error:', error));
    };

    const handleValueUpdate = (data, deviceId) => {
        console.log('Received data:', data);
        const pulse = data[1];
        const oxygen = data[2];
        setPulse(pulse);
        setOxygen(oxygen);
    };

    useEffect(() => {
        if (!connected) return;
        BleManager.retrieveServices(device.id)
            .then(services => BleManager.retrieveCharacteristicsForService(device.id, SERVICE_UUID))
            .then(characteristics => BleManager.write(device.id, SERVICE_UUID, CHARACTERISTIC_UUID, [1, 1]))
            .then(() => {
                console.log('Subscribed to notifications');
                BleManager.startNotification(device.id, SERVICE_UUID, CHARACTERISTIC_UUID)
                    .then(() => console.log('Notification started'))
                    .catch(error => console.log('Notification error:', error));
                BleManager.onCharacteristicValueChanged(device.id, SERVICE_UUID, CHARACTERISTIC_UUID, handleValueUpdate);
            })
            .catch(error => console.log('Characteristics retrieval error:', error));
    }, [connected]);

    return (
        <View>
            <Text>Oximeter Data:</Text>
            {connected ? (
                <>
                    <Text>Pulse: {pulse}</Text>
                    <Text>Oxygen: {oxygen}</Text>
                    <Button title="Disconnect" onPress={disconnectFromDevice} />
                </>
            ) : (
                <>
                    <Button title="Scan" onPress={scanForDevices} />
                    <Button title="Connect" onPress={connectToDevice} />
                </>

            )
            }

        </View>
    )
}
export default Oximeter
