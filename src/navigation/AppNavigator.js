import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Colors from '../constants/Colors'
//screens
import EnterDateScreen from '../screens/EnterDateScreen'
import ViewOutputScreen from '../screens/ViewOutputScreen'

const DatePickerStack = createStackNavigator();

const AppNavigator = () => {

    const DatePickerStackScreen = () => (
        <DatePickerStack.Navigator
            initialRouteName="EnterDateScreen"
        >
            <DatePickerStack.Screen 
                name="EnterDateScreen"
                component={EnterDateScreen}
                options={() => ({
                    title: 'Home',
                    headerStyle: {
                        backgroundColor: Colors.PRIMARY_BG_COLOR
                    },
                    headerTintColor: Colors.PRIMARY_COLOR,
                })}
            />
            <DatePickerStack.Screen 
                name="ViewOutputScreen"
                component={ViewOutputScreen}
                options={() => ({
                    title: 'Is Business Day ?',
                    headerStyle: {
                        backgroundColor: Colors.PRIMARY_BG_COLOR
                    },
                    headerTintColor: Colors.PRIMARY_COLOR,
                })}
            />
        </DatePickerStack.Navigator>
    );
    
    return (
        <NavigationContainer>
            <DatePickerStackScreen/>
        </NavigationContainer>
    );
};

export default AppNavigator;
