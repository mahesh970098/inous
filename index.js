/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { YellowBox } from 'react-native';
import { LogBox } from 'react-native';


LogBox.ignoreLogs(['Warning: ...']);

LogBox.ignoreAllLogs();

YellowBox.ignoreWarnings(['Warning: ...']);

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
