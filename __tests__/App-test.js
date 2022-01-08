/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import EnterDateScreen from '../src/screens/EnterDateScreen'
import { _setDateinFormat, _setOutputDateFormat, addToDate, isWeekend, _getListOfHolidays} from '../src/components/businessLogic'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
global.fetch = require('jest-fetch-mock');

it('renders correctly', () => {
	renderer.create(<App />);
});

test('EnterDateScreen renders correctly', () => {
	const tree = renderer.create(<EnterDateScreen />).toJSON();
	expect(tree).toMatchSnapshot();
});

describe('Checking isWeekend Func', ()=>{
	it('Check wether entered date is a weekend when date entered is weekend', ()=>{
		expect(isWeekend(new Date(`2022-01-08`)))
		.toEqual(new Date(`2022-01-10`))
	});

	it('Check wether entered date is a weekend when date entered is weekday', ()=>{
		expect(isWeekend(new Date(`2022-01-07`)))
		.toEqual(new Date(`2022-01-07`))
	});

	it('Check when invalid date is entered', ()=>{
		expect(isWeekend(new Date('banana')))
		.toBeUndefined()
	});
});

describe('Add to date when there is a public holiday', ()=>{
	it('Check wether entered date is a weekend when date entered is weekend', ()=>{
		expect(addToDate(new Date(`2022-01-08`)))
		.toEqual(new Date(`2022-01-10`))
	});

	it('Check wether entered date is a weekend when date entered is weekday', ()=>{
		expect(addToDate(new Date(`2022-01-10`)))
		.toEqual(new Date(`2022-01-11`))
	});

	it('Check when invalid date is entered', ()=>{
		expect(addToDate(new Date('banana')))
		.toBeUndefined()
	});
});

describe('When business date is found, parse date in correct format', ()=>{
	it('Check if date in required format is returned', ()=>{
		expect(_setOutputDateFormat(new Date(`2022-01-07`)))
		.toEqual(`2022-1-7`)
	});

	it('Check when invalid date is entered', ()=>{
		expect(_setOutputDateFormat(new Date('banana')))
		.toBeUndefined()
	});
});

describe('Making sure date is without any time for strict time comparision', ()=>{
	it('Check if date in required format is returned', ()=>{
		expect(_setDateinFormat(new Date(`2022-01-07`)))
		.toEqual(new Date(`2022-01-07`))
	});

	it('Check when invalid date is entered', ()=>{
		expect(_setDateinFormat(new Date('banana')))
		.toBeUndefined()
	});
});

beforeEach(() => {
	fetch.resetMocks();
})

test('returns 1st object data as new years day 01/01/year', () => {
	const onResponse = jest.fn();
	const onError = jest.fn();
  
	return _getListOfHolidays('2020')
	  .then(onResponse)
	  .catch(onError)
	  .finally(() => {
		// console.log('it is ::',onResponse.mock.calls[0][0].data[0].date);
		expect(onResponse).toHaveBeenCalled();
		expect(onError).not.toHaveBeenCalled();
		expect(onResponse.mock.calls[0][0].data[0].date).toEqual('2020-01-01');
	  });
});

test('returns error when year is invalid input', () => {
	const onResponse = jest.fn();
	const onError = jest.fn();
  
	return _getListOfHolidays('apple')
	  .then(onResponse)
	  .catch(onError)
	  .finally(() => {
		console.log('it is ::',onResponse.mock.results[0].value);
		expect(onResponse).toHaveBeenCalled();
		expect(onError).not.toHaveBeenCalled();
		expect(onResponse.mock.results[0].value).toBeUndefined();
	  });
});
