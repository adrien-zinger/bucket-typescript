import GenVCProblem from "./internal/GeneticVC.impl";
import { GraphNO, Vertex, Edge } from "./tools/graph";
import Random from "./tools/random";
import { readline } from "./tools/readline";

function createCompleteGraph(length: number): GraphNO {
    let vertices: Vertex[] = [];
    let edges: Edge[] = [];
    for (let i = 0; i < length; ++i) {
        const name: string = String.fromCharCode(i - 97);
        vertices.forEach(vertex => edges.push(
            new Edge(vertex.id, name, Random.range(0, 15))));
        vertices.push(new Vertex(name));
    }
    return new GraphNO(vertices, edges);
}

function main() {
    const graph: GraphNO = createCompleteGraph(20);
    let vc: GenVCProblem = new GenVCProblem(graph);
    while (true) {
        vc.run();
        console.log(vc.getPath(), vc.getScore());
        readline();
    }
}

main();