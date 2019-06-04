const localization = require('./localization.json')

module.exports = class Evaluation{
    constructor(adjective, weight, reading, extremeHigh, slightHigh, slightLow=Number.NEGATIVE_INFINITY, extremeLow=Number.NEGATIVE_INFINITY, lowAdjective=null){
        this.weight = weight
        this.reading = reading

        var concl = 0
        if (reading > slightHigh) concl++
        if (reading > extremeHigh) concl++
        if (reading < slightLow) concl--
        if (reading < extremeLow) concl--
        this.value=concl
        
        this.weightedValue = Math.abs(this.value)*weight
        this.inWords = localization.degrees[Math.abs(this.value)] + ' '
        if (this.value > 0) this.inWords += adjective
        else if (this.value == 0 && slightLow == Number.NEGATIVE_INFINITY) this.inWords = 'not ' + adjective //Means 0 and scalar
        else this.inWords += lowAdjective || adjective
    }
}