// import React, { Component } from 'react';
// import { View, Text } from 'react-native';
// import BleManager from 'react-native-ble-manager';

// export default class OximeterExample extends Component {
//     state = {
//         device: null,
//         values: null,
//     };

//     componentDidMount() {
//         BleManager.start({ showAlert: false });

//         this.startScan();
//     }

//     startScan = () => {
//         BleManager.scan([], 30, true)
//             .then(results => {
//                 console.log(results, "resulyts")
//                 // Filter the results to find the oximeter device
//                 const device = results.find(d => d.name === 'My Oximeter');


//                 if (!device) {
//                     throw new Error('Oximeter device not found');
//                 }

//                 this.setState({ device }, () => {
//                     this.connect();
//                 });
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//         //         BleManager.scan([], 30, true)
//         //   .then(results => {
//         //     console.log('Scan results:', results);
//         //   })
//         //   .catch(error => {
//         //     console.error('Error while scanning:', error);
//         //   });
//     };

//     connect = () => {
//         const { device } = this.state;

//         BleManager.connect(device.id)
//             .then(() => {
//                 this.readValues();
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     };

//     readValues = () => {
//         const { device } = this.state;
// // const characteristicUUID = '00002a37-0000-1000-8000-00805f9b34fb';
// const characteristicUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'

//         BleManager.read(device.id, characteristicUUID)
//             .then(data => {
//                 // Extract the values from the data
//                 const values = this.extractValues(data);

//                 this.setState({ values });
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     };

//     extractValues = data => {
//         // Your implementation to extract the values from the data
//         // ...

//         return {
//             // Example values
//             pulse: 72,
//             saturation: 96,
//         };
//     };

//     render() {
//         const { values } = this.state;

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
//             </View>
//         );
//     }
// }

import React, { Component } from 'react';
import { View, Text, PermissionsAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';

export default class OximeterExample extends Component {
    state = {
        values: null,
        devices: [],
        oximeter: null,
        connected: false,
        pulse: 0,
        spo2: 0,
    };

    componentDidMount() {
        this.requestBluetoothPermission();
        BleManager.start({ showAlert: false });

        this.startScan();

        this.scanForOximeter()
    }

    requestBluetoothPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Bluetooth Permission',
                    message: 'This app requires access to Bluetooth',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                BleManager.start({ showAlert: false });

                this.startScan();
            } else {
                console.error('Bluetooth permission denied');
            }
        } catch (error) {
            console.error(error);
        }
    };

    startScan = () => {
        console.log("scaned clicked")

        // BleManager.scan([], 3, true).then((results) => {
        //     console.log('Scanning...');
        //     setIsScanning(true);
        // }).catch(err => {
        //     console.error(err);
        // });
        BleManager.scan([], 30, true)
            .then(results => {
                console.log(results, "results")
                this.setState({ devices: results });

                this.connectToOximeter();
            })
            .catch(error => {
                console.error('Error while scanning:', error);
            });
    };

    connectToOximeter = () => {
        const { devices } = this.state;
        console.log(devices, "devices")


        if (devices) {
            const oximeter = devices.find(device => device.name === 'oximeter');

            if (oximeter) {
                BleManager.connect(oximeter.id)
                    .then(() => {
                        console.log(`Connected to ${oximeter.name}`);

                        this.setState({ connected: true, oximeter });
                        this.subscribeToValues(oximeter.id);
                    })
                    .catch(error => {
                        console.error(`Failed to connect to ${oximeter.name}:`, error);
                    });
            }
        }
    };

    subscribeToValues = deviceId => {
        BleManager.startNotification(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
            .then(() => {
                console.log(`Subscribed to values of ${deviceId}`);
            })
            .catch(error => {
                console.error(`Failed to subscribe to values of ${deviceId}:`, error);
            });

        BleManager.read(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
            .then(value => {
                const pulse = value[0];
                const spo2 = value[1];

                this.setState({ pulse, spo2 });
            })
            .catch(error => {
                console.error(`Failed to read values from ${deviceId}:`, error);
            });
    };



    scanForOximeter = async () => {
        var OXIMETER_SERVICE_UUID = 'cdeacb80-5235-4c07-8846-93a37ee6b86d'
        var PULSE_CHARACTERISTIC_UUID = 'cdeacb81-5235-4c07-8846-93a37ee6b86d'
        try {
            // Scan for devices
            const devices = await BleManager.scan([OXIMETER_SERVICE_UUID], 5, true);
            // Find the oximeter device
            const oximeterDevice = devices.find(device => device.name === 'MyOximeter');
            if (!oximeterDevice) {
                setError('Oximeter not found');
                return;
            }

            // Connect to the oximeter device
            await BleManager.connect(oximeterDevice.id);
            // Retrieve the services and characteristics of the oximeter device
            const peripheralInfo = await BleManager.retrieveServices(oximeterDevice.id);
            // Find the pulse characteristic
            const pulseCharacteristic = peripheralInfo.characteristics.find(characteristic => characteristic.uuid === PULSE_CHARACTERISTIC_UUID);
            if (!pulseCharacteristic) {
                setError('Pulse characteristic not found');
                return;
            }

            // Read the pulse characteristic
            const data = await BleManager.read(oximeterDevice.id, OXIMETER_SERVICE_UUID, PULSE_CHARACTERISTIC_UUID);
            // Parse the pulse value from the data buffer
            const pulseValue = parsePulseValue(data);
            // Update the state with the pulse value
            setPulse(pulseValue);
        } catch (error) {
            // Handle any errors
            setError(`Error while reading pulse: ${error.message}`);
        }
    };
    render() {

        const { connected, pulse, spo2, values } = this.state;

        return (
            <View>
                {values ? (
                    <View>
                        <Text>Pulse: {values.pulse}</Text>
                        <Text>Saturation: {values.saturation}</Text>
                    </View>
                ) : (
                    <Text>Scanning for oximeter device...</Text>
                )}

                <View>
                    <Text>{connected ? 'Connected' : 'Not Connected'}</Text>
                    <Text>Pulse: {pulse}</Text>
                    <Text>SpO2: {spo2}</Text>
                </View>
            </View>
        );
    }
}








// // import React, { useState, useEffect } from 'react';
// // import BleManagers from 'react-native-ble-plx';
// // import BleManager from 'react-native-ble-manager';

// // import {
// //     View,
// //     Text,
// //     ProgressSteps,
// //     ProgressStep,
// //     StyleSheet,
// //     TouchableOpacity,
// //     Image,
// //     Linking,
// //     BackHandler,
// //     Dimensions,
// //     Switch,
// //     PermissionsAndroid,
// //     Button
// // } from "react-native";

// // const App = () => {
// //     const [devices, setDevices] = useState([]);
// //     const [readings, setReadings] = useState([]);

// //     React.useEffect = (() => {
// //         const blu = async () => {
// //             console.log("useeffect")



// //             //             // if (granted === PermissionsAndroid.RESULTS.GRANTED) {


// //             //                 const manager = new BleManager();
// //             //                 manager.startDeviceScan(null, null, (error, device) => {
// //             //                     if (error) {
// //             //                         console.log(error);
// //             //                         return;
// //             //                     }

// //             //                     if (device.name === 'Oximeter') {
// //             //                         setDevices([...devices, device]);
// //             //                         manager.stopDeviceScan();
// //             //                         device
// //             //                             .connect()
// //             //                             .then(device => {
// //             //                                 return device.discoverAllServicesAndCharacteristics();
// //             //                             })
// //             //                             .then(device => {
// //             //                                 return device.readCharacteristicForService(
// //             //                                     'service-uuid',
// //             //                                     'characteristic-uuid'
// //             //                                 );
// //             //                             })
// //             //                             .then(characteristic => {
// //             //                                 setReadings([...readings, characteristic.value]);
// //             //                             })
// //             //                             .catch(error => {
// //             //                                 console.log(error);
// //             //                             });
// //             //                     }
// //             //                 });
// //             // //
// //             //             // }

// //             // const result = await requestMultiple([
// //             //     PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
// //             //     PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
// //             //     PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
// //             // ]);
// //             // if (
// //             //     result['android.permission.BLUETOOTH_CONNECT'] ===
// //             //     PermissionsAndroid.RESULTS.GRANTED
// //             // ) {


// //             // }
// //         }
// //         blu()

// //     })

// //     useEffect(() => {

// //     }, []);


// //     const bleManager = new BleManager();

// //     async function startScanning() {
// //         console.log('Scanning for devices...');

// //         try {
// //             await bleManager.startDeviceScan(null, null, (error, device) => {
// //                 if (error) {
// //                     console.log('Error while scanning: ', error);
// //                     return;
// //                 }

// //                 if (device.name === 'YourOximeterName') {
// //                     console.log('Found device: ', device.name);
// //                     bleManager.stopDeviceScan();
// //                     connectToDevice(device);
// //                 }
// //             });
// //         } catch (error) {
// //             console.log('Error while scanning: ', error);
// //         }
// //     }

// //     async function connectToDevice(device) {
// //         console.log('Connecting to device...');

// //         try {
// //             const connectedDevice = await bleManager.connectToDevice(device.id);
// //             console.log('Connected to device: ', connectedDevice.name);
// //             retrieveData(connectedDevice);
// //         } catch (error) {
// //             console.log('Error while connecting: ', error);
// //         }
// //     }

// //     async function retrieveData(device) {
// //         console.log('Retrieving data...');

// //         try {
// //             await device.discoverAllServicesAndCharacteristics();
// //             const data = await device.readCharacteristicForService('YourServiceUUID', 'YourCharacteristicUUID');
// //             console.log('Data: ', data);
// //         } catch (error) {
// //             console.log('Error while retrieving data: ', error);
// //         }
// //     }

// //     // startScanning();




// //     return (
// //         <>

// //             <Button onPress={startScanning}>Scanning</Button>


// //             <Text>{`Devices: ${JSON.stringify(devices)}`}</Text>
// //             <Text>{`Readings: ${JSON.stringify(readings)}`}</Text>
// //         </>
// //     );
// // };

// // export default App;


























// // /////////////////////////////////////another coding


// // // const bleManager = new BleManager();

// // // bleManager.startDeviceScan(null, null, (error, device) => {
// // //     if (error) {
// // //         console.log('error', error);
// // //         return;
// // //     }

// // //     if (device.name === 'YourOximeterName') {
// // //         bleManager.stopDeviceScan();
// // //         console.log('Found device: ', device.name);
// // //         // Connect to the device and retrieve data
// // //     }
// // // });

// // // bleManager.connectToDevice(device.id, {
// // //     timeout: 5000,
// // // }).then((device) => {
// // //     console.log('Connected to', device.name);
// // //     // Retrieve data from the device
// // //     device.discoverAllServicesAndCharacteristics()
// // //         .then((device) => {
// // //             console.log('Discovered services and characteristics');
// // //             // Read the value of the characteristic
// // //             device.readCharacteristicForService('YourServiceUUID', 'YourCharacteristicUUID')
// // //                 .then((value) => {
// // //                     console.log('Value: ', value);
// // //                 });
// // //         });
// // // }).catch((error) => {
// // //     console.log('Connection error', error);
// // // });

// import React, { useState, useEffect } from 'react';
// import BleManager from 'react-native-ble-plx';
// import {
//     View,
//     Text,
//     ProgressSteps,
//     ProgressStep,
//     StyleSheet,
//     TouchableOpacity,
//     Image,
//     Linking,
//     BackHandler,
//     Dimensions,
//     Switch
// } from "react-native";

// const App = () => {
//     const [devices, setDevices] = useState([]);
//     const [readings, setReadings] = useState([]);

//     useEffect(() => {
//         const manager = new BleManager();
//         manager.startDeviceScan(null, null, (error, device) => {
//             if (error) {
//                 console.log(error);
//                 return;
//             }

//             if (device.name === 'Oximeter') {
//                 setDevices([...devices, device]);
//                 manager.stopDeviceScan();
//                 device
//                     .connect()
//                     .then(device => {
//                         return device.discoverAllServicesAndCharacteristics();
//                     })
//                     .then(device => {
//                         return device.readCharacteristicForService(
//                             'service-uuid',
//                             'characteristic-uuid'
//                         );
//                     })
//                     .then(characteristic => {
//                         setReadings([...readings, characteristic.value]);
//                     })
//                     .catch(error => {
//                         console.log(error);
//                     });
//             }
//         });
//     }, []);

//     return (
//         <>
//             <Text>{`Devices: ${JSON.stringify(devices)}`}</Text>
//             <Text>{`Readings: ${JSON.stringify(readings)}`}</Text>
//         </>
//     );
// };

// export default App;
