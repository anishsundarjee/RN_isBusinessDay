import React from 'react'
import { StyleSheet, SafeAreaView, View, Dimensions} from 'react-native'
import { Headline, Card, Subheading, Button } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Colors from '../constants/Colors';

const {height, width} = Dimensions.get('window');

const ViewOutputScreen = ({navigation, route}) => {
    const {businessDay} = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <Card style={styles.cardStyle}>
                <View style={styles.headerViewStyle}>
                    <Headline style={styles.headerTextStyle}>
                        Next Available Business Date 
                    </Headline>
                </View>
                <View style={styles.subHeadingViewStyle}>
                    <View style={{alignSelf:'center', marginTop: 20, flex:1}}>
                        <FontAwesome5 name="business-time" size={50} color={Colors.HINT_COLOR} style={{marginHorizontal: 10}}/>
                    </View>
                    <View style={{flex:2}}>
                        <Subheading style={styles.subHeadingTextStyle}>
                            {businessDay}
                        </Subheading>
                        <Button
                            mode="contained"
                            onPress={() => navigation.goBack()}
                            color={Colors.ACCENT_COLOR}
                            style={{width: width - 50, alignSelf:'center', marginTop: 20}}
                        >
                            Check another date ?
                        </Button>
                    </View>
                    
                </View>
                
            </Card>
        </SafeAreaView>
    )
};

export default ViewOutputScreen;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Colors.WHITE,
    },
    cardStyle: {
        backgroundColor: Colors.PRIMARY_BG_COLOR,
        width: width - 20,
        height: height/2,
        margin: 10,
        shadowColor: Colors.ACCENT_COLOR,
        shadowOpacity: 5,
        elevation: 4,
        borderRadius: 10,
    },
    headerViewStyle: {
        flex:1,
        alignSelf:'center',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    headerTextStyle: {
        fontSize: 20,
        color: Colors.HINT_COLOR,
        letterSpacing: 2,
        textAlign:'center',
        fontWeight: '600',
    },
    subHeadingTextStyle: {
        fontSize: 18,
        color: Colors.ACCENT_COLOR,
        letterSpacing: 2,
        textAlign:'center',
        fontWeight: '400',
    },
    subHeadingViewStyle: {
        alignSelf:'center',
        marginHorizontal: 10,
        flex:3
    },
});
