import Random from "../random";

/***
 * Arbre couvrants minimaux
 * 
 * 
 */
class Vertex {
    public key: number = Infinity; // cost from here to the parent
    public parent: string = ''; // vertex parent
    constructor(public id: string) {}
}

function extractMin(vertices: Map<string, Vertex>): Vertex {
    let ret: Vertex = new Vertex('');
    vertices.forEach(v => {
        if (v.key < ret.key)
            ret = v;
    });
    vertices.delete(ret.id);
    return ret;
}

function assignScore(score: number, vertex: Vertex, parent: string) {
    if (vertex.key > score) {
        vertex.key = score;
        vertex.parent = parent;
    }
}

export function prim(allVerticeIds: Set<string>,
                    getAdjacents: ((vertexId: string) => [string, number][]), 
                    onVertexVisit?: ((vertexId: string) => void),
                    firstVertexId?: string) {
    // set the first vertex
    if (firstVertexId == undefined)
        firstVertexId = Array.from(allVerticeIds)[Random.range(0, allVerticeIds.size - 1)];
    const first = new Vertex(firstVertexId)
    first.key = 0;
    let vertices: Map<string, Vertex> = new Map();
    vertices.set(first.id, first);
    while (allVerticeIds.size > 0) {
        const u = extractMin(vertices);
        allVerticeIds.delete(u.id);
        if (onVertexVisit != undefined)
            onVertexVisit(u.id);
        getAdjacents(u.id).forEach((edge: [string, number]) => {
            if (allVerticeIds.has(edge[0])) {
                if (!vertices.has(edge[0]))
                    vertices.set(edge[0], new Vertex(edge[0]));
                assignScore(edge[1], vertices.get(edge[0])!, u.id);
            }
        });
            
    }
}