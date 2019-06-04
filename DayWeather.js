const WeatherState = require('./WeatherState.js')

module.exports = {
    analyzeDay(totalData){
        var hourData = []
        var bestHour = null
        for (const hour of totalData['data']){ //Get all hours and best hour
            const hourState = new WeatherState(hour)
            if (hourState.hour == 0) break;
            if (bestHour == null) bestHour = hourState
            if (hourState.total > bestHour.total) bestHour = hourState
            hourData.push(hourState)
        }

        var goodHours = []
        for (const hourState of hourData){ //Get hours that are almost the best
            if (hourState.total >= bestHour.total - 1) goodHours.push(hourState)
        }
        
        var hourGroups = []
        tempGroup = []
        for (var i=0; i<goodHours.length-1; i++){ //Now making groups of good hours
            if (tempGroup.length==0){
                tempGroup = [goodHours[i]]
            }
            if (goodHours[i+1].hour != goodHours[i].hour+1){ //This means a break in good hours in a row
                tempGroup += [goodHours[i]]
                hourGroups.push(tempGroup)
                tempGroup = []
            }
        }
        tempGroup.push(goodHours[goodHours.length-1])
        hourGroups.push(tempGroup)

        this.timeText = 'The best times to walk today are '
        var times = []
        for (group of hourGroups){
            if (group[1] == null) times.push(group[0].timeString) 
            else times.push('from ' + group[0].timeString + ' to ' + group[1].timeString)
        }
        if (times.length>1) this.timeText += times.slice(0, -1).join(', ') + ', and ' + times[times.length-1]
        else this.timeText += times[0]
        this.timeText += '. The best will be ' + bestHour.timeString + ', when it will be ' + bestHour.message + '.'

        console.log(this.timeText)
    }
}