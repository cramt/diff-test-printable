import { EulersMethod } from './DifferentialAlgorithms/EulersMethod';
import { BackwardsFiniteDifferenceApproximation } from './DifferentialAlgorithms/BackwardsFiniteDifferenceApproximation';
import { CentralFiniteDifferenceApproximation } from './DifferentialAlgorithms/CentralFiniteDifferenceApproximation';
import * as math from "mathjs"
import { DifferentialAlgorithm } from "./DifferentialAlgorithm";
import { MathFunction } from "./MathFunction";
import { ForwardFiniteDifferenceApproximation } from './DifferentialAlgorithms/ForwardFiniteDifferenceApproximation';
import * as fs from "fs"

export const GLOBAL_DELTA_X_VALUE = 0.001;


export interface TestResult {
    function: MathFunction;
    derivative: MathFunction;
    dataSet: {
        [key: number]: number
    };
    alogritmResult: {
        [key: string]: {
            [key: number]: {
                speed: number
                result: number
                precision: number
            }
        }
    }
}

export function createAlgorithms(f: MathFunction): Promise<DifferentialAlgorithm[]> {
    let inits: DifferentialAlgorithm[] = [
        new CentralFiniteDifferenceApproximation(),
        new ForwardFiniteDifferenceApproximation(),
        new BackwardsFiniteDifferenceApproximation(),
        new EulersMethod()
    ]
    return Promise.all<DifferentialAlgorithm>(inits.map(x => x.Prepare(f)))
}

export function getUnixTime() {
    return (new Date() as any as number) * 1
}

export function generateRandomNumbers(l: number): number[] {
    let re: number[] = [];
    for (let i = 0; i < l; i++) {
        re[re.length] = math.random(0, 100);
    }
    return re;
}

export async function generateTestResults(testFunctions: MathFunction[], testPoints: number[]): Promise<TestResult[]> {
    let re: TestResult[] = [];
    testFunctions.map(func => {
        let derivative = math.derivative(func, "x");
        let result: TestResult = {
            function: func,
            derivative: derivative.toString(),
            dataSet: {},
            alogritmResult: {}
        }
        testPoints.forEach(testPoint => {
            result.dataSet[testPoint] = derivative.eval({ x: testPoint })
        });
        re[re.length] = result;
    });
    return re;
}

(async () => {
    const testFunctions: MathFunction[] = [
        "x^sin(x)",
        "log(x)",
        "12^x",
        "x^2",
        "e^x",
        "64^x",
        "tan(x)",
        "((x^4)+22)^(1/4)",
    ]

    const testPoints = generateRandomNumbers(500);

    const testResults = await generateTestResults(testFunctions, testPoints);

    for (let i = 0; i < testResults.length; i++) {
        console.log("doing test for " + testResults[i].function)
        const algorithms = await createAlgorithms(testResults[i].function)
        await algorithms.map(async algorithm => {
            console.log("doing test for " + algorithm.Name)
            testResults[i].alogritmResult[algorithm.Name] = {}
            await Object.getOwnPropertyNames(testResults[i].dataSet).map(parseFloat).map(async testNumber => {
                let unixTime = getUnixTime()
                let result = await algorithm.Run(testNumber)
                let speed = getUnixTime() - unixTime;
                testResults[i].alogritmResult[algorithm.Name][testNumber] = {
                    precision: (result - testResults[i].dataSet[testNumber]) / testResults[i].dataSet[testNumber],
                    speed: speed,
                    result: result
                }
            })
        })
    }
    console.log("done")
    fs.createWriteStream("data.json").write(JSON.stringify(testResults))
})()