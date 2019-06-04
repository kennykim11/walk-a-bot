const https = require('https')
const express = require('express')
const DayWeather = require('./DayWeather.js')

const latitude = 42.8033127
const longitutde = -78.6467248
const apiKey = '376ab1ed62714ae5b70b8f826488c0de'
const defaultPath = '/v2.0/history/hourly?'

const debug = true //Just console messages
const testing = false //Doesn't conside timezones, which have resulted in "too far in the future" problems


const request_getHourlyWeather = {
    hostname: 'api.weatherbit.io',
    path: createPath(),
    method: 'GET'
}


function dateToString(date){
    if (testing) return date.toJSON().slice(0,10) //Fake one
    return date.toLocaleString().split(',')[0].replace(/\//g,'-')
}

function createPath(){
    //https://stackoverflow.com/questions/23081158/javascript-get-date-of-the-next-day/23081260
    const NYTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    const today = new Date(NYTime)
    const tomorrow = new Date(NYTime)
    tomorrow.setDate(today.getDate()+1)
    const stringParts = [
        defaultPath+'key='+apiKey,
        'lat='+latitude,
        'lon='+longitutde,
        'start_date='+dateToString(today),
        'end_date='+dateToString(tomorrow),
        'units=I'
    ]
    if (!testing) stringParts.push('tz=local')
    finalString = stringParts.join('&')
    if (debug) console.log('Sending: '+finalString)
    return finalString
    //https://api.weatherbit.io/v2.0/history/hourly?city=Raleigh,NC&start_date=2019-05-30&end_date=2019-05-31&tz=local&key=API_KEY
}

https.request(request_getHourlyWeather, handleResponse).end()

function handleResponse(response){
    //We're getting an HTTPS response that has both meta data and real data.
    var data = '';
    response.setEncoding('utf8');
    //Collect all of the data packets before interperting
    response.on('data', function(chunk){
        data += chunk
    })
    response.on('end', () => {
        if (debug) console.log(data.toString())
        DayWeather.analyzeDay(JSON.parse(data))
    })
}