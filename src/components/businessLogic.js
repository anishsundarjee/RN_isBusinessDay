import React from 'react'
// import { showMessage } from "react-native-flash-message";
import axios from 'axios';

const ENDPOINT = 'https://date.nager.at/api/v3/publicholidays/'
const COUNTRY = 'AU'

export const isWeekend = (input) => {
    try {
        if(isNaN(input.getTime())) {
            return undefined;
        }
        let checkDate = new Date(input);
        if(checkDate.getDay() === 6) { //if saturday, set to monday
            checkDate = checkDate.setDate(checkDate.getDate() + 2);
        }
        else if(checkDate.getDay() === 0) { //if sunday, set to monday
            checkDate = checkDate.setDate(checkDate.getDate() + 1);
        }
        else { //all good
            console.log('check :',checkDate);
        }
        return new Date(checkDate);
    } catch (error) {
        console.log('Error occured checking date for weekend',error)
        return error;
    }
}

export const addToDate = (input) => {
    try {
        if(isNaN(input.getTime())) {
            return undefined;
        }
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
        return new Date(checkDate);
    } catch (error) {
        console.log('Error occured adding to date if public holiday',error)
        return error;
    }
}

export const _setDateinFormat = (input) => {
    try {
        if(isNaN(input.getTime())) {
            return undefined;
        }
        let currentDayOfMonth = input.getDate();
        currentDayOfMonth < 9 ? currentDayOfMonth = `0${currentDayOfMonth}` : currentDayOfMonth

        let currentMonth = input.getMonth() + 1; // note! January is 0, not 1
        currentMonth < 10 ? currentMonth = `0${currentMonth}` : currentMonth

        const currentYear = input.getFullYear();

        return new Date(currentYear + "-" + currentMonth + "-" + currentDayOfMonth);
    } catch (error) {
        return error;
    }
}

export const _setOutputDateFormat = (input) => {
    try {
        if(isNaN(input.getTime())) {
            return undefined;
        }
        const currentDayOfMonth = input.getDate();
        const currentMonth = input.getMonth() + 1; // note! January is 0, not 1
        const currentYear = input.getFullYear();
        return currentYear + "-" + currentMonth + "-" + currentDayOfMonth
    } catch (error) {
        return error;
    }
}

export const _getListOfHolidays = async (input) => {
    try {
        if(isNaN(input)) {
            return undefined;
        }
        let res = null;
        const URL = `${ENDPOINT}${input}/${COUNTRY}`;
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
        return error;
    }
}
