import 'react-native-gesture-handler';
import React from 'react'
import { View, Platform, StyleSheet, StatusBar } from 'react-native';
import FlashMessage from "react-native-flash-message";
import Colors from './src/constants/Colors'
import AppNavigator from './src/navigation/AppNavigator'

const App = () => {
	return (
		<View style={styles.container}>
			{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
			<AppNavigator/>
			<FlashMessage position="top" /> 
		</View>
	)
};

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.PRIMARY_BG_COLOR,
	},
});
