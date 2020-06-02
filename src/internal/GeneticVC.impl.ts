import { approximate } from "../tools/algos/VCApproximation";
import { GeneticProcessSync } from "../tools/abstract/genetic";
import { GraphNO, Vertex } from "../tools/graph";
import Random from "../tools/random";

export default class GenVCProblem extends GeneticProcessSync<Vertex[]> {

    private input: GraphNO;
    constructor(input: GraphNO) {
        let vertices = approximate(input);
        super([vertices], 100);
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
        return approximate(this.input);
    }

    public getPath(): Vertex[] {
        return this._generation[0].adn;
    }

    public getScore(): number {
        return this._generation[0].score;
    }
}