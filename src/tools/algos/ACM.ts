import Random from "../random";
import * as graph from "../graph";

/***
 * Arbre couvrants minimaux
 * 
 * 
 */
class Vertex extends graph.Vertex {
    key: number = Infinity; // cost from here to the parent
    parent: string = ''; // vertex parent
    constructor(id: string) {
        super(id);
    }
}

function extractMin(vertices: Map<string, Vertex>): Vertex {
    let ret: Vertex = new Vertex('');
    vertices.forEach(v => {
        if (v.key < ret.key) {
            ret = v;
        }
    });
    vertices.delete(ret.id);
    return ret;
}

function assignScore(edge: graph.Edge, vertex: Vertex, parent: string) {
    if (vertex.key > edge.w) {
        vertex.key = edge.w;
        vertex.parent = parent;
    }
}

export function prim(input: graph.GraphNO, onVertexVisit?: ((vertex: graph.Vertex) => void),
                     firstVertex?: string) {
    input.initMatrix(); // allow access of getAdjacents function
    // Initialisation
    // copy of vertices
    let vertices: Map<string, Vertex> = new Map();
    for (let vertex of input.vertices)
        vertices.set(vertex.id, new Vertex(vertex.id));
    // set the first vertex
    if (firstVertex == undefined)
        firstVertex = input.vertices[Random.range(0, input.vertices.length - 1)].id;
    vertices.get(firstVertex)!.key = 0;
    while (vertices.size > 0) {
        const u = extractMin(vertices);
        if (onVertexVisit != undefined)
            onVertexVisit(u, );
        for (let edge of input.getAdjacents(u))
            if (edge.a == u.id && vertices.has(edge.b)) // give a score to b
                assignScore(edge, vertices.get(edge.b)!, u.id);
            else if (vertices.has(edge.a)) // give a score to a
                assignScore(edge, vertices.get(edge.a)!, u.id);
    }
    input.clearMatrix();
}