import React from 'react'
import { StyleSheet, Platform, SafeAreaView, View, Dimensions, TouchableOpacity, Text } from 'react-native'
import { Headline, Card, Subheading, Button } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const ENDPOINT = 'https://date.nager.at/api/v3/publicholidays/'
const COUNTRY = 'AU'

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

    const isWeekend = (input) => {
        try {
            let checkDate = new Date(input);
            if(checkDate.getDay() === 6) {
                checkDate = checkDate.setDate(checkDate.getDate() + 2);
            }
            else if(checkDate.getDay() === 0) {
                checkDate = checkDate.setDate(checkDate.getDate() + 1);
            }
            else {
                console.log('check :',checkDate);
            }
            return new Date(checkDate);
        } catch (error) {
            console.log('Error occured checking date for weekend',error)
        }
    }

    const addToDate = (input) => {
        try {
            let checkDate = new Date(input);
            if(checkDate.getDay() === 6) { //saturday
                checkDate = checkDate.setDate(checkDate.getDate() + 2);
            }
            else if(checkDate.getDay() === 5) { //friday
                checkDate = checkDate.setDate(checkDate.getDate() + 3);
            }
            else { //other weekdays or sunday
                checkDate = checkDate.setDate(checkDate.getDate() + 1);
            }
            console.log('updated date is : ',new Date(checkDate));
            return new Date(checkDate);
        } catch (error) {
            console.log('Error occured checking date for weekend',error)
        }
    }

    const _getListOfHolidays = async (input) => {
        try {
            let checkDate = input;
            const year = checkDate.getFullYear();
            let res = null;
            const URL = `${ENDPOINT}${year}/${COUNTRY}`;
            await axios.get(URL,{ timeout:5000,
                headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            }})
            .then(response => {
                res = response;
            }).catch(error => {
                res = error.response.status;
            });
            return res;
        } catch (error) {
            console.log('Error checking for holiday from remote',error);
            showMessage({
                message: "No Network",
                description: "Need network connectivity to work",
                type: "custom",
                icon: "custom",
                floating: true,
                duration: 3000
            });
        }
    }

    const _setDateinFormat = (input) => {
        let currentDayOfMonth = input.getDate();
        currentDayOfMonth < 9 ? currentDayOfMonth = `0${currentDayOfMonth}` : currentDayOfMonth

        let currentMonth = input.getMonth() + 1; // note! January is 0, not 1
        currentMonth < 10 ? currentMonth = `0${currentMonth}` : currentMonth

        const currentYear = input.getFullYear();

        return new Date(currentYear + "-" + currentMonth + "-" + currentDayOfMonth);
    }

    const _setOutputDateFormat = (input) => {
        const currentDayOfMonth = input.getDate();
        const currentMonth = input.getMonth() + 1; // note! January is 0, not 1
        const currentYear = input.getFullYear();

        return currentYear + "-" + currentMonth + "-" + currentDayOfMonth
    }

    const _checkDate = async () => {
        try {
            const checkDate = date;
            let weekday = isWeekend(checkDate);
            let dateCheck = _setDateinFormat(weekday);
            let holidayOutput = await _getListOfHolidays(weekday);
            let businessDay = null;
            if(holidayOutput.status === 200) {
                holidayOutput.data.map((obj, index) => {
                    let output = Math.abs(new Date(obj.date)) - Math.abs(dateCheck);
                    if(output === 0) {
                        dateCheck = addToDate(dateCheck);  
                        if(index === holidayOutput.data.length - 1) {
                            businessDay = dateCheck;
                        }
                    }
                    else if(output < 0) {
                        if(index === holidayOutput.data.length - 1) {
                            businessDay = dateCheck;
                        }
                    }
                    else {
                        businessDay = dateCheck;
                    }
                    // console.log('here we go ::',output, new Date(obj.date), dateCheck, index);
                });
            } else if(holidayOutput.status === 204){
                businessDay = dateCheck;
            } else {
                showMessage({
                    message: "Something went wrong",
                    description: "Invalid data was input.",
                    type: "danger",
                    icon: "danger",
                    floating: true,
                });
            }
            navigation.navigate('ViewOutputScreen',{businessDay: _setOutputDateFormat(businessDay)});
        } catch (error) {
            console.log('Error occured finding business date',error);
        }
    }

    const validateBusinessDate = () => {
        try {
            setIsLoading(true)
            if (Object.prototype.toString.call(date) === "[object Date]") {
                // it is a date
                _checkDate();
                if (isNaN(date.getTime())) {
                    // date is not valid
                    showMessage({
                        message: "Invalid Input",
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
                            >
                                <Ionicons name="calendar" size={28} color={Colors.PRIMARY_COLOR} style={{marginHorizontal: 10}}/>
                                <Text style={styles.DatePickerTextStyle}>
                                    {displayDate == null || displayDate.length == 0 ? "Tap to enter date." : _setOutputDateFormat(date)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Button
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
