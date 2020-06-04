import GenVCProblem from "./internal/GeneticVC.impl";
import { GraphNO, Vertex, Vertices, Edges } from "./tools/graph";
import Random from "./tools/random";

function createCompleteGraph(): GraphNO {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let vertices: Vertices = new Vertices();
    let edges: Edges = new Edges(vertices);
    for (let i = 0; i < alphabet.length; ++i) {
        const name: string = alphabet[i];
        vertices.add(name, 0);
        vertices.foreach(vertex => {
            if (vertex.id != name)
                edges.add(vertex.id, name, Random.range(0, 15));
        });
    }
    return new GraphNO(vertices, edges);
}

function main() {
    let graph: GraphNO = createCompleteGraph();
    console.log("work with generated graph", graph.vertices, graph.edges);
    let vc: GenVCProblem = new GenVCProblem(graph);
    console.log("run once to get all population");
    vc.run();
    let generation: [Vertex[], number][] = vc.getGeneration(); // list of tuple containing adn and score
    for (let people of generation) {
        let path = '';
        people[0].forEach(element => path += " " + element.id);
        path = path.substring(1);
        console.log(path, people[1]);
    }
    console.log("run 20 times");
    for (let i = 0; i < 20; ++i) {
        vc.run();
        let path = '';
        vc.getPath().forEach(element => path += " " + element.id);
        path = path.substring(1);
        console.log(path, graph.getTotalWeight(vc.getPath()));
    }
}

main();