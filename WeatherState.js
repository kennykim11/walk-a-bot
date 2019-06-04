const Evaluation = require('./Evaluation.js')

module.exports = class WeatherState{
    constructor(data){
        this.grades = []
        //adjective, weight, reading, extremeHigh, slightHigh, slightLow=Number.NEGATIVE_INFINITY, extremeLow=Number.NEGATIVE_INFINITY, lowAdjective=null
        this.grades['windSpeed'] = new Evaluation('breezy', 1, data['wind_dir'], 30, 15)
        this.grades['temperature'] = new Evaluation('warm', 1, data['app_temp'], 85, 75, 65, 55, 'cold')
        this.grades['humidity'] = new Evaluation('humid', 1, data['rh'], 58, 49, 41, 32, 'dry')
        this.grades['cloudiness'] = new Evaluation('cloudy', 0, data['clouds'], 2, 1)
        this.grades['preciptation'] = new Evaluation('rainy', 3, data['precip'], 20, 10)

        this.total = 0;
        for (const grade of this.grades) {
            console.log(grade.weightedValue)
            this.total += grade.weightedValue
            console.log('Total: ' + this.total)
        }

        var messages = []
        for (const gradeName in this.grades) messages.push((this.grades[gradeName]).inWords)
        this.message = messages.slice(0, -1).join(', ') + ', and ' + messages[messages.length-1]

        this.uvWarning = null
        if (data['uv'] > 4.5) this.uvWarning = 'The UV index is over 4.5, you should wear sunscreen!'

        this.hour = parseInt(data['timestamp_local'].split('T')[1].substring(0,2), 10)

        const period = this.hour <= 12 ? ' AM' : ' PM'
        this.timeString = (this.hour % 12).toString() + period
    }
}