import React, { Component } from 'react';

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
import BleManager from 'react-native-ble-manager';

class OximeterExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            device: null,
            value: '',
        };
    }

    componentDidMount() {
        BleManager.start({ showAlert: false });
        BleManager.scan([], 3, true).then((results) => {
            console.log('Scanning...');

            console.log(results, "results");

            if (device) {
                var device = results.find((device) => device.name === 'My Oximeter');
                console.log(device, "devicessssssssss")
                this.setState({ device: device });
                BleManager.connect(device.id)
                    .then(() => {
                        console.log('Connected');
                        BleManager.retrieveServices(device.id)
                            .then((peripheralInfo) => {
                                console.log(peripheralInfo);
                                var service = 'cdeacb80-5235-4c07-8846-93a37ee6b86d';
                                var characteristic = 'cdeacb82-5235-4c07-8846-93a37ee6b86d';
                                BleManager.read(device.id, service, characteristic)
                                    .then((readData) => {
                                        console.log('Read: ' + readData);
                                        this.setState({ value: readData });
                                    })
                                    .catch((error) => {
                                        console.log('Error reading data', error);
                                    });
                            })
                            .catch((error) => {
                                console.log('Error retrieving services', error);
                            });
                    })
                    .catch((error) => {
                        console.log('Error connecting', error);
                    });
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Oximeter Value: {this.state.value}</Text>

                <View style={{ margin: 10 }}>
                    <Button
                        title={' peripherals ?'}
                    // onPress={() => startScan()}
                    />
                </View>
            </View>
        );
    }
}

export default OximeterExample;


// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import BleManager from 'react-native-ble-manager';

// const OximeterPage = () => {
//     const [deviceId, setDeviceId] = useState('');
//     const [spo2, setSpo2] = useState('');
//     const [pulseRate, setPulseRate] = useState('');

//     useEffect(() => {
//         BleManager.start({ showDebug: true });
//         if (Platform.OS === 'android' && Platform.Version >= 23) {
//             PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
//                 if (result) {
//                     console.log("Permission is OK");
//                 } else {
//                     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
//                         if (result) {
//                             console.log("User accept");
//                         } else {
//                             console.log("User refuse");
//                         }
//                     });
//                 }
//             });
//         }
//         scanForDevices();
//     }, []);

//     const scanForDevices = () => {
//         BleManager.scan([], 30, (error, devices) => {

//             if (error) {
//                 console.log(error);
//             } else {
//                 devices.forEach((device) => {
//                     if (device.name === 'My Oximeter') {
//                         console.log(device, "dec=vices")
//                         console.log(device.name, "device name")

//                         setDeviceId(device.id);
//                         connectToDevice();
//                     }
//                 });
//             }
//         });
//     };

//     const connectToDevice = () => {
//         BleManager.connect(deviceId)
//             .then(() => {
//                 console.log('Connected');
//                 readSpo2Value();
//                 readPulseRateValue();
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const readSpo2Value = () => {
//         BleManager.read(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
//             .then((data) => {
//                 setSpo2(data[0]);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const readPulseRateValue = () => {
//         BleManager.read(deviceId, 'cdeacb80-5235-4c07-8846-93a37ee6b86d', 'cdeacb81-5235-4c07-8846-93a37ee6b86d')
//             .then((data) => {
//                 setPulseRate(data[0]);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     return (
//         <View>
//             <Text>SpO2: {spo2}</Text>
//             <Text>Pulse Rate: {pulseRate}</Text>
//         </View>
//     );
// };

// export default OximeterPage;
