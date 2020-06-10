import GenTSProblem from "./internal/GeneticTS.impl";
import { Graph, Vertex, Vertices, Edges } from "./tools/graph";
import Random from "./tools/random";

function createCompleteGraph(): Graph {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let vertices: Vertices = new Vertices();
    let edges: Edges = new Edges(vertices);
    for (let i = 0; i < alphabet.length; ++i) {
        const name: string = alphabet[i];
        vertices.set(name, 0);
        vertices.foreach(vertex => {
            if (vertex.id != name)
                edges.set(vertex.id, name, Random.range(0, 15));
        });
    }
    return new Graph(vertices, edges);
}

function main() {
    let graph: Graph = createCompleteGraph();
    //console.log("work with generated graph", graph.vertices, graph.edges);
    let vc: GenTSProblem = new GenTSProblem(graph);
    console.log("run once to get all population");
    vc.process().then(() => {
        let generation: [Vertex[], number][] = vc.getGeneration(); // list of tuple containing adn and score
        for (let people of generation) {
            let path = '';
            people[0].forEach(element => path += " " + element.id);
            path = path.substring(1);
            console.log(path, people[1]);
        }
        console.log("actual score", graph.getTotalWeight(vc.getPath()));
        console.log("run 20 times");
        return vc.process(20);
    }).then(() => {
        console.log("actual score", graph.getTotalWeight(vc.getPath()));
    });
    
    
}

main();