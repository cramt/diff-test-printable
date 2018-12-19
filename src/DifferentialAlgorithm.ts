import { MathFunction } from "./MathFunction";

export abstract class DifferentialAlgorithm {
    abstract async Prepare(f: MathFunction): Promise<DifferentialAlgorithm>
    abstract async Run(x: number): Promise<number>
    abstract get Name(): string;
}