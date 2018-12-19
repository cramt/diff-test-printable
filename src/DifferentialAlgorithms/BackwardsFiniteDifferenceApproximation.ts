import { GLOBAL_DELTA_X_VALUE } from "..";
import { MathFunction } from "../MathFunction";
import math from "mathjs";
import { DifferentialAlgorithm } from "../DifferentialAlgorithm";

export class BackwardsFiniteDifferenceApproximation extends DifferentialAlgorithm {
    of: (x: number) => number;
    df: (x: number) => number;
    halfH = GLOBAL_DELTA_X_VALUE / 2;
    async Prepare(f: MathFunction): Promise<DifferentialAlgorithm> {
        let strFunc = math.compile(f)
        this.of = x => {
            return strFunc.eval({ x: x }) as number
        }
        this.df = x => {
            return (this.of(x) - this.of(x - GLOBAL_DELTA_X_VALUE)) / GLOBAL_DELTA_X_VALUE
        }
        return this;
    }
    async Run(x: number): Promise<number> {
        return this.df(x);
    }
    get Name() {
        return "backwards finite difference approximation"
    }
}