import { GLOBAL_DELTA_X_VALUE } from "..";
import { MathFunction } from "../MathFunction";
import math from "mathjs";
import { DifferentialAlgorithm } from "../DifferentialAlgorithm";

export class EulersMethod extends DifferentialAlgorithm {
    f: (x: number) => number;
    tableX: number[] = []
    tableY: number[] = []
    async Prepare(f: MathFunction): Promise<DifferentialAlgorithm> {
        let strFunc = math.compile(f)
        this.f = x => {
            return strFunc.eval({ x: x }) as number
        }
        return this;
    }
    async Run(point: number): Promise<number> {
        let oldX = this.tableX.length === 0 ? 0 : this.tableX[this.tableX.length - 1]
        let oldY = this.f(oldX)
        if (oldX === 0) {
            this.tableY[this.tableY.length] = oldY
            this.tableX[this.tableX.length] = oldX
        }
        let stepSize = GLOBAL_DELTA_X_VALUE
        while (point > oldX) {
            let newX = oldX + stepSize
            let newY = this.f(newX)
            this.tableY[this.tableY.length] = newY
            this.tableX[this.tableX.length] = newX
            oldX = newX
            oldY = newY
        }
        let index = Math.floor(point / stepSize)
        let x1 = this.tableX[index]
        let x2 = this.tableX[index + 1]
        let y1 = this.tableY[index]
        let y2 = this.tableY[index + 1]
        return (y2 - y1) / (x2 - x1)
    }
    get Name() {
        return "eulers method"
    }
}