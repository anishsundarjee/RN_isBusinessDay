import React from 'react'
import { StyleSheet, Platform, SafeAreaView, View, Dimensions, TouchableOpacity, Text } from 'react-native'
import { Headline, Card, Subheading, Button } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';
import {_setDateinFormat, _setOutputDateFormat, addToDate, isWeekend, _getListOfHolidays} from '../components/businessLogic'

const { width } = Dimensions.get('window');

const EnterDateScreen = ({navigation}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [displayDate, setDisplayDate] = React.useState(null);
    const [date, setDate] = React.useState(new Date());

    const _renderDatePicker = () =>{
        if(Platform.OS==='android'){
            if(showDatePicker){
                return (
                    <DateTimePicker
                        testID='android-datePicker'
                        value={date}
                        mode="date"
                        display="default"
                        maximumDate={new Date(2050, 0, 1)}
                        minimumDate={new Date(1970, 0, 2)}
                        onChange={ async (e, d) => {
                            setShowDatePicker(false);
                            if(e.type == "set") {
                                setDate(d);
                                setDisplayDate(d.toDateString())
                            }
                        }}
                        style={{ backgroundColor: 'white' }}
                    />
                );
            } else return null;
        }
    }

    const _checkDate = React.useCallback(async ()=>{
        try {
            const checkDate = date;
            const weekday = isWeekend(checkDate);
            let dateCheck = _setDateinFormat(weekday);
            let holidayOutput = await _getListOfHolidays(weekday.getFullYear());
            let businessDay = null;
            if(holidayOutput.status === 200) {
                holidayOutput.data.map((obj, index) => {
                    let output = Math.abs(new Date(obj.date)) - Math.abs(dateCheck);
                    if(output === 0) { //chosen date is a holiday
                        dateCheck = addToDate(dateCheck); //check for next date available
                        if(index === holidayOutput.data.length - 1) { //if no more holidays left make current dateCheck the next business day
                            businessDay = dateCheck;
                        }
                    }
                    else if(output < 0) { //these dates have past
                        if(index === holidayOutput.data.length - 1) { 
                            businessDay = dateCheck;
                        }
                    }
                    else { //if has no holidays then current dateCheck is a business day
                        businessDay = dateCheck;
                    }
                    // console.log('here we go ::',output, new Date(obj.date), dateCheck, index);
                });
            } else if(holidayOutput.status === 204){ // if there is no data for the current country, we take dateCheck as business day
                businessDay = dateCheck;
            } else { //something was wrong with the data that was input
                showMessage({
                    message: "Something went wrong",
                    description: "Invalid data was input.",
                    type: "danger",
                    icon: "danger",
                    floating: true,
                });
            }
            if(businessDay !== null || businessDay !== undefined) {
                navigation.navigate('ViewOutputScreen',{businessDay: _setOutputDateFormat(businessDay)});
            }
        } catch (error) {
            console.log('Error occured finding business date',error);
        }
    },[date]);

    const validateBusinessDate = () => {
        try {
            setIsLoading(true)
            if (Object.prototype.toString.call(date) === "[object Date]") {
                // it is a date
                _checkDate();
                if(isNaN(date.getTime())) {
                    // date is not valid
                    showMessage({
                        message: "Invalid Date",
                        description: "Invalid data was input.",
                        type: "danger",
                        icon: "danger",
                        floating: true,
                    });
                } else {
                    // date is valid
                    _checkDate();
                }
            } else {
                // not a date
                showMessage({
                    message: "Invalid Input",
                    description: "Invalid data was input.",
                    type: "danger",
                    icon: "danger",
                    floating: true,
                });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log('Error occured validating business date format',error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Card style={styles.cardStyle}>
                <View style={styles.headerViewStyle}>
                    <Headline style={styles.headerTextStyle}>
                        Welcome to Business Day Checker
                    </Headline>
                </View>
                <View style={styles.wrapperViewStyle}>
                    <View style={styles.subHeadingViewStyle}>
                        <Subheading style={styles.subHeadingTextStyle}>
                            Choose date from below date picker
                        </Subheading>
                    </View>
                    <View style= {styles.DatePickerViewStyle}>
                        <Text style={styles.DatePickerLableStyle}>Business Date</Text>
                        { Platform.OS == "ios" ? (
                            <DateTimePicker
                                testID='ios-datePicker'
                                placeholderText="Enter date"
                                value={date}
                                mode="date"
                                display="compact"
                                onChange={ async (e, d) => {
                                    // console.log(d);
                                    setDate(d);
                                    setDisplayDate(d.toDateString());
                                }}
                                maximumDate={new Date(2050, 0, 1)}
                                minimumDate={new Date(1970, 0, 2)}
                                style={styles.DatePickerButtonStyle}
                            />
                        ):(
                            <TouchableOpacity 
                                onPress={()=>setShowDatePicker(true)}
                                style={styles.DatePickerButtonStyle}
                                testID='android-datepickerViewButton'
                            >
                                <Ionicons name="calendar" size={28} color={Colors.PRIMARY_COLOR} style={{marginHorizontal: 10}}/>
                                <Text style={styles.DatePickerTextStyle}>
                                    {displayDate == null || displayDate.length == 0 ? "Tap to enter date." : _setOutputDateFormat(date)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Button
                        testID='submit-button'
                        icon="briefcase-edit"
                        mode="contained"
                        onPress={() => validateBusinessDate()}
                        color={Colors.HINT_COLOR}
                        style={{width: width - 50, alignSelf:'center', marginTop: 20}}
                        disabled={isLoading}
                    >
                        Check Date
                    </Button>
                </View>
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </Card>
            {_renderDatePicker()}
        </SafeAreaView>
    )
};

export default EnterDateScreen;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Colors.WHITE,
    },
    spinnerTextStyle: {
        color: Colors.PRIMARY_COLOR
      },
    cardStyle: {
        backgroundColor: Colors.PRIMARY_BG_COLOR,
        flex:1,
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
        fontSize: 24,
        color: Colors.HINT_COLOR,
        letterSpacing: 1,
        textAlign:'center',
        fontWeight: '600',
    },
    subHeadingTextStyle: {
        fontSize: 16,
        color: Colors.ACCENT_COLOR,
        letterSpacing: 1,
        textAlign:'center',
        fontWeight: '400',
    },
    subHeadingViewStyle: {
        alignSelf:'center',
        marginHorizontal: 10,
    },
    center: {
        justifyContent: 'center',
        alignItems:'center',
    },
    DatePickerViewStyle : {
        flexDirection: 'column', 
        alignSelf:'center', 
        width: width - 30, 
        justifyContent:'center', 
        marginVertical: 5,
        left: 10 
    },
    DatePickerLableStyle: {
        fontSize: 16, 
        fontWeight: '600', 
        color: Colors.ACCENT_COLOR, 
        paddingVertical: 5
    },
    DatePickerButtonStyle: {
        width: width - 50, 
        height: 50, 
        borderWidth: 1, 
        borderRadius:10, 
        borderColor: Colors.TEXTBOX_BORDER, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    DatePickerTextStyle: {
        alignSelf:'center', 
        fontSize: 16, 
        fontWeight: '500', 
        color: Colors.ACCENT_COLOR
    },
    wrapperViewStyle: {
        width: width - 20,
        flex:3,
        alignSelf:'center',
        justifyContent:'flex-start',
    },
});
