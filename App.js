import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'

const App = () => {
	return (
		<SafeAreaView style={styles.container}>
			<Text>Parent screen on app</Text>
		</SafeAreaView>
	)
};

export default App;

const styles = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor: '#f5f5f5'
	},
});
