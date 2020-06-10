import { AlphaBeta, AlphaBetaNode} from "../src/tools/abstract/alphabeta"
import { Graph, Vertices, Edges, Vertex } from "../src/tools/graph"

function printTree(graph: Graph, current: Vertex, indent: string, last: boolean) {
    let write = indent;
    if (last) {
        write += "\\-";
        indent += "  ";
    } else {
        write += "|-";
        indent += "| ";
    }
    console.log(write + current.id + ": " + current.cost);
    const childs = graph.getAdjacents(current);
    for (let i = 0; i < childs.length; ++i)
        printTree(graph, childs[i].b, indent, i == childs.length - 1);
}

class ABNode implements AlphaBetaNode {
    constructor(private vertices: Vertices,
        public readonly id: string,
        public readonly min: boolean) {}
    set value(value) { this.vertices.set(this.id, value) }
    get value() { return this.vertex.cost }
    get vertex() { return this.vertices.get(this.id) }
}

class ABSearch extends AlphaBeta<ABNode> {
    constructor(private readonly graph: Graph) {super()}

    protected isLeaf(node: ABNode): boolean {
        return this.graph.getAdjacents(node.vertex).length == 0;
    }

    protected getNexts(node: ABNode): ABNode[] {
        let ret: ABNode[] = [];
        for (const e of this.graph.getAdjacents(node.vertex))
            ret.push(new ABNode(this.graph.vertices, e.b.id, !node.min));
        return ret;
    }

    protected evaluation(node: ABNode): number {
        console.log("evaluate:", node.vertex.id);
        return node.vertex.cost;
    }
}

function main() {
    let vertices: Vertices = new Vertices();
    let edges: Edges = new Edges(vertices, true);
    for (let i = 1; i < 20; ++i)
        vertices.set(i.toString(), 0);
    const costs = [5, 6, 7, 4, 5, 3, 6, 6, 9, 7, 5, 9, 8, 6];
    for (let i = 0; i < costs.length; ++i)
        vertices.set((i + 20).toString(), costs[i]);
    vertices.set("test", 0);
    vertices.set("testchild1", 10);
    vertices.set("testchild2", 3);
    vertices.set("testchild3", 1);

    const childs = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 5],
        [2, 6],
        [3, 7],
        [3, 8],
        [4, 9],
        [4, 10],
        [5, 11],
        [5, 12],
        [6, 13],
        [7, 14],
        [7, 15],
        [8, 16],
        [9, 17],
        [10, 18],
        [10, 19],
        [11, 20],
        [11, 21],
        [12, 22],
        [12, 23],
        [12, 24],
        [13, 25],
        [14, 26],
        [15, 27],
        [15, 28],
        [16, 29],
        [17, 30],
        [18, 31],
        [18, 32],
        [19, 33]
    ];
    for (let c of childs)
        edges.set(c[0].toString(), c[1].toString(), 0);
    edges.set("2", "test", 0);
    edges.set("test", "testchild1", 0);
    edges.set("test", "testchild2", 0);
    edges.set("test", "testchild3", 0);
    let graph = new Graph(vertices, edges);
    let abSearch = new ABSearch(graph);
    abSearch.run(new ABNode(vertices, '1', false));
    printTree(graph, vertices.get('1'), "", false);
}


main();