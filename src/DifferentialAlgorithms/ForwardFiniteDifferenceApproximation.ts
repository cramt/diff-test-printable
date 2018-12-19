import { DifferentialAlgorithm } from "../DifferentialAlgorithm";
import { MathFunction } from "../MathFunction";
import math from "mathjs";
import { GLOBAL_DELTA_X_VALUE } from "..";

export class ForwardFiniteDifferenceApproximation extends DifferentialAlgorithm {
    of: (x: number) => number;
    df: (x: number) => number;
    async Prepare(f: MathFunction): Promise<DifferentialAlgorithm> {
        let strFunc = math.compile(f)
        this.of = x => {
            return strFunc.eval({ x: x }) as number
        }
        this.df = x => {
            return (this.of(x + GLOBAL_DELTA_X_VALUE) - this.of(x)) / GLOBAL_DELTA_X_VALUE
        }
        return this;
    }
    async Run(x: number): Promise<number> {
        return this.df(x);
    }
    get Name() {
        return "forward finite difference approximation"
    }
}

