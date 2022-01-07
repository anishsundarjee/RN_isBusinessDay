import React from 'react'
import { StyleSheet, Text, SafeAreaView } from 'react-native'

const EnterDateScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>View Output Screen</Text>
        </SafeAreaView>
    )
};

export default EnterDateScreen;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#f5f5f5'
    },
});
