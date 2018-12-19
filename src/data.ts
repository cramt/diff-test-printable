import { TestResult } from './index';
import * as fs from "fs"

//load data
let data = JSON.parse(fs.readFileSync("data.json").toString()) as TestResult[]

let individualData = data.map(testResult => {
    return {
        function: testResult.function,
        data: Object.getOwnPropertyNames(testResult.alogritmResult).map(algorithmName => {
            let algorithm = testResult.alogritmResult[algorithmName]
            let numbers = Object.getOwnPropertyNames(algorithm).map(parseFloat)
            let speed = numbers.map(number => {
                return algorithm[number].speed
            })
            let precision = numbers.map(number => {
                return algorithm[number].precision
            })
            let precisionAverage = precision.reduce((a, b) => a + b, 0) / precision.length
            let speedAverage = speed.reduce((a, b) => a + b, 0) / speed.length
            let precisionMedian = precision.sort()[precision.length / 2]
            let speedMedian = speed.sort()[speed.length / 2]
            return {
                algorithmName: algorithmName,
                precisionAverage: precisionAverage,
                speedAverage: speedAverage,
                precisionMedian: precisionMedian,
                speedMedian: speedMedian
            }
        })
    }
})
let processed = {} as any

individualData.forEach(individual => {
    let sorted = {} as {
        [key: string]: typeof individual.data
    }
    individual.data.forEach(algorithmData => {
        if (sorted[algorithmData.algorithmName] === undefined) {
            sorted[algorithmData.algorithmName] = []
        }
        sorted[algorithmData.algorithmName][sorted[algorithmData.algorithmName].length] = algorithmData
    })
    console.log(sorted)
    Object.getOwnPropertyNames(sorted).forEach(algorithmName => {
        let addedTogether = {
            algorithmName: algorithmName,
            precisionAverage: 0,
            speedAverage: 0,
            precisionMedian: 0,
            speedMedian: 0
        }
        sorted[algorithmName].forEach(x => {
            addedTogether.precisionAverage += x.precisionAverage
            addedTogether.precisionMedian += x.precisionMedian
            addedTogether.speedAverage += x.speedAverage
            addedTogether.speedMedian += x.speedMedian
        })
        //console.log(addedTogether)
        let average = {
            algorithmName: algorithmName,
            precisionAverage: addedTogether.precisionAverage / sorted[algorithmName].length,
            precisionMedian: addedTogether.precisionMedian / sorted[algorithmName].length,
            speedAverage: addedTogether.speedAverage / sorted[algorithmName].length,
            speedMedian: addedTogether.speedMedian / sorted[algorithmName].length,
        }
        processed[algorithmName] = average
    })
})

let processedData = {
    individualData: individualData,
    processed: processed
}

fs.createWriteStream("processedData.json").write(JSON.stringify(processedData))