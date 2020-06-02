
export class Edge {
    constructor (public a: string,
        public b: string,
        public w: number = 1) {};
}

export class Vertex {
    constructor(public id: string) {};
}

/**
 * Graph non orienté
 */
export class GraphNO {
    private matrix: Map<string, Edge[]> | null = null;
    constructor(public vertices: Vertex[], public edges: Edge[], private keepMatrix = false) {
        if (keepMatrix) {
            this.initMatrix();
        }
    }

    public initMatrix() {
        if (this.matrix != null) return;
        this.matrix = new Map<string, Edge[]>();
        this.edges.forEach(edge => {
            for (let v of [edge.a, edge.b]) {
                let m = this.matrix!.get(v);
                if (m == undefined) {
                    this.matrix!.set(v, [edge]);
                } else {
                    this.matrix!.set(v, m.concat(edge));
                }
            }
        });
    }

    public clearMatrix() {
        if (!this.keepMatrix) this.matrix = null;
    }

    public getAdjacents(vertex: Vertex): Edge[] {
        if (this.matrix == null || !this.matrix.has(vertex.id)) return [];
        return this.matrix.get(vertex.id)!;
    }

    /**
     * Compute the weigth of a path. We assume that the graph is complete so if an
     * edge doesn't exist we will add 0 in the total weight.
     * @param vertices path to follow
     */
    public getTotalWeight(vertices: Vertex[]): number {
        if (this.matrix == null || vertices.length <= 1) return 0;
        let edges: Edge[] | undefined = this.matrix.get(vertices[0].id);
        let ret: number = 0;
        for (let i = 1; i < vertices.length; ++i) {
            if (edges == undefined) return 0;
            for (let edge of edges) {
                if (edge.a == vertices[i].id || edge.b == vertices[i].id) {
                    ret += edge.w;
                    break; // here we suppose that there is only one edge between two vertices
                }
            }
            edges = this.matrix.get(vertices[i].id);
        }
        return ret;
    }
}