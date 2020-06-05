/**
 * Genetic approach to solve the travelling salesman problem
 * 
 * 
 */



import { approximate } from "../tools/algos/VCApproximation";
import { GeneticProcessASync } from "../tools/abstract/genetic";
import { GraphNO, Vertex } from "../tools/graph";
import Random from "../tools/random";

export default class GenTSProblem extends GeneticProcessASync<Vertex[]> {

    private input: GraphNO;
    constructor(input: GraphNO) {
        let vertices = approximate(input);
        super([vertices], 20);
        this.input = input;
    }

    protected reproduction(vertices: Vertex[]): Vertex[] {
        const i: number = Random.range(0, vertices.length - 1);
        const j: number = Random.range(0, vertices.length - 1);
        const v: Vertex = vertices[i];
        vertices[i] = vertices[j];
        vertices[j] = v;
        return vertices;
    }

    protected score(vertices: Vertex[]): number {
        return 1 / this.input.getTotalWeight(vertices);
    }

    protected mutation(): Vertex[] {
        let ret = approximate(this.input);
        return ret;
    }

    public getPath(): Vertex[] {
        return this._generation[0].adn;
    }

    public getScore(): number {
        return this._generation[0].score;
    }

    public getGeneration(): [Vertex[], number][] {
        let ret: [Vertex[], number][] = [];
        for (let person of this._generation) {
            ret.push([person.adn, person.score]);
        }
        return ret;
    }

    public async process(times: number = 1) {
        for (let i = 0; i < times; ++i) {
            await this.apopulate();
            await this.arun();
        }
    }
}