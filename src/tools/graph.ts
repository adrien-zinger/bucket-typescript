
export class Edge {
    private readonly _a: [string, number];
    private readonly _b: [string, number];
    constructor (a: Vertex | string, b: Vertex | string,
        public w: number = 1, // weight of the edge
        private vertices: Vertices // reference to all edges
        ) {
            if (a instanceof Vertex) this._a = [a.id, a.cost];
            else this._a = [(a as string), 0];
            if (b instanceof Vertex) this._b = [b.id, b.cost];
            else this._b = [(b as string), 0];
    };
    public get a(): Vertex {
        const ret = this.vertices!.get(this._a[0]);
        if (ret == undefined)
            throw new Error("Cannot find vertex in vertices reference");
        return ret!;
    }
    public get b(): Vertex {
        const ret = this.vertices!.get(this._b[0]);
        if (ret == undefined)
            throw new Error("Cannot find vertex in vertices reference");
        return ret!;
    }
}

export class Edges {
    private edges: Map<string, Map<string, number>> = new Map();
    private edgesPool: Map<string, Edge> = new Map();
    private static sMaxEdgesInPool = 100;

    private sizeModif: boolean = false; // Flag used to know if the size has been changed
    private _size: number = 0; // Size computed only on call

    constructor (
        // reference to all vertex (should refere to each vertex in edges)
        private vertices: Vertices,
        // by default we don't check if the edges a - b corresponding to b - a
        public readonly oriented: boolean = false) {}

    public addEdge(edge: Edge) {
        this.set(edge.a.id, edge.b.id, edge.w);
    }

    public set(a: string, b: string, w: number) {
        this.sizeModif = true;
        if (this.oriented) {
            if (!this.edges.has(a))
                this.edges.set(a, new Map());
            this.edges.get(a)!.set(b, w);
        } else {
            if (a > b) {
                if (!this.edges.has(a))
                    this.edges.set(a, new Map());
                this.edges.get(a)!.set(b, w);
            } else {
                if (!this.edges.has(b))
                    this.edges.set(b, new Map());
                this.edges.get(b)!.set(a, w);
            }
        }
    }

    private appendInPool(a: string, b: string, w: number, key: string): Edge {
        if (this.edgesPool.size >= Edges.sMaxEdgesInPool) {
            const keys = this.edgesPool.keys();
            for (let i = 0; i < this.edgesPool.size / 2; ++i)
                this.edgesPool.delete(keys.next().value);
        }
        const edge = new Edge(a, b, w, this.vertices);
        return this.edgesPool.set(key, edge), edge;
    }

    public exists(a: string, b: string): boolean {
        return this.edges.has(a) && this.edges.get(a)!.has(b);
    }

    public get(a: string, b: string, unidirectionnal: boolean = true): Edge[] {
        let ret: Edge[] = [];
        const key: string = a + " " + b;
        if (unidirectionnal) {
            if (this.edgesPool.has(key))
                ret.push(this.edgesPool.get(key)!);
            else if (!this.oriented) {
                if (a > b && this.exists(a, b)) {
                    ret.push(this.appendInPool(a, b,
                        this.edges.get(a)!.get(b)!, key));
                } else if (this.exists(b, a)) {
                    ret.push(this.appendInPool(b, a,
                        this.edges.get(b)!.get(a)!, key));
                }
            } else if (this.exists(a, b)) {
                ret.push(this.appendInPool(a, b,
                    this.edges.get(a)!.get(b)!, key));
            }
        } else ret = this.get(a, b).concat(this.get(b, a));
        return ret;
    }

    public neighboor(vertexId: string): Edge[] {
        let ret: Edge[] = [];
        // Obvious get
        if (this.edges.has(vertexId))
            this.edges.get(vertexId)!.forEach((w, key) =>
                ret.push(new Edge(vertexId, key, w, this.vertices)));
        // If the current graph is not oriented we need to
        // check each edges
        if (!this.oriented) {
            this.edges.forEach((m, key) => {
                if (key != vertexId && m.has(vertexId)) {
                    // In the edge we swap a and b but there is no impact while the graph
                    // is not oriented.
                    ret.push(new Edge(vertexId,
                        key,
                        m.get(vertexId),
                        this.vertices));
                }
            });
        }
        return ret;
    }

    public get size(): number {
        if (this.sizeModif) {
            this._size = 0;
            //console.log(this.edges);
            this.edges.forEach(v => this._size += v.size);
            this.sizeModif = false;
        }
        return this._size;
    }
}

export class Vertex {
    constructor(public id: string, public cost: number = 0) {};
}

export class Vertices {
    private verticesIds: Map<string, number> = new Map();

    public addVertex(vertex: Vertex) {
        this.set(vertex.id, vertex.cost);
    }

    public set(id: string, cost: number) {
        this.verticesIds.set(id, cost);
    }

    public get(id: string): Vertex | undefined {
        let ret: Vertex | undefined = undefined;
        if (this.verticesIds.has(id))
            ret = new Vertex(id, this.verticesIds.get(id));
        return ret;
    }

    public foreach(action: (vertex: Vertex) => void) {
        this.verticesIds.forEach((cost: number, id: string) => action(new Vertex(id, cost)));
    }

    public get size() {
        return this.verticesIds.size;
    }
}

/**
 * Generic Graph implementation
 */
export class Graph {
    constructor(
        public vertices: Vertices,
        public edges: Edges
    ) {}

    public getAdjacents(vertex: Vertex): Edge[] {
        return this.edges.neighboor(vertex.id);
    }

    /**
     * Compute the weigth of a path. We assume that the graph is complete so if an
     * edge doesn't exist we will add 0 in the total weight.
     * @param path path to follow
     */
    public getTotalWeight(path: Vertex[]): number {
        let edges: Edge[] = this.edges.neighboor(path[0].id);
        let ret: number = 0;
        for (let i = 1; i < path.length; ++i) {
            for (let edge of edges) {
                if (edge.a.id == path[i].id || edge.b.id == path[i].id) {
                    ret += edge.w;
                    break; // here we suppose that there is only one edge between two vertices
                }
            }
            edges = this.edges.neighboor(path[i].id);
        }
        return ret;
    }
}