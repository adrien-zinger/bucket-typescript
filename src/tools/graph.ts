
export class Edge {
    private readonly _a: [string, number];
    private readonly _b: [string, number];
    constructor (a: Vertex | string, b: Vertex | string,
        public w: number = 1, // weight of the edge
        private vertices?: Vertices // reference to all edges
        ) {
            if (a instanceof Vertex) this._a = [a.id, a.cost];
            else this._a = [(a as string), 0];
            if (b instanceof Vertex) this._b = [b.id, b.cost];
            else this._b = [(b as string), 0];
    };
    public get a(): Vertex {
        if (this.vertices == undefined)
            return new Vertex(this._a[0], this._a[1]);
        else {
            const ret = this.vertices!.get(this._a[0]);
            if (ret == undefined)
                throw new Error("Cannot find vertex in vertices reference");
            return ret!;
        }
    }
    public get b(): Vertex {
        if (this.vertices == undefined)
            return new Vertex(this._b[0], this._b[1]);
        else {
            const ret = this.vertices!.get(this._b[0]);
            if (ret == undefined)
                throw new Error("Cannot find vertex in vertices reference");
            return ret!;
        }
    }
}

export class Edges {
    private edges: Map<string, Map<string, number>> = new Map();
    private edgesPool: Map<string, Edge> = new Map();
    private static sMaxEdgesInPool = 100;

    constructor (
        // reference to all vertex (should refere to each vertex in edges)
        private vertices: Vertices,
        // by default we don't check if the edges a - b corresponding to b - a
        private readonly oriented: boolean = false) {}

    public addEdge(edge: Edge) {
        this.add(edge.a.id, edge.b.id, edge.w);
    }

    public add(a: string, b: string, w: number) {
        if (this.edges.get(a) == undefined)
            this.edges.set(a, new Map());
        this.edges.get(a)!.set(b, w);
        if (!this.oriented) {
            if (this.edges.get(b) == undefined)
                this.edges.set(b, new Map());
            this.edges.get(b)!.set(a, w);
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

    public get(a: string, b: string, unidirectionnal: boolean = true): Edge[] {
        let ret: Edge[] = [];
        const key: string = a + " " + b;
        if (!unidirectionnal)
            if (this.edgesPool.has(key))
                ret.push(this.edgesPool.get(key)!);
            else if (this.edges.has(a) && this.edges.get(a)!.has(b))
                ret.push(this.appendInPool(a, b,
                    this.edges.get(a)!.get(b)!, key));
        else
            ret = this.get(a, b).concat(this.get(b, a));
        return ret;
    }

    public neighboor(vertexId: string): Edge[] {
        let ret: Edge[] = [];
        const na = this.edges.get(vertexId);
        if (na != undefined)
            na.forEach((w: number, b: string) =>
                ret.push(new Edge(vertexId, b, w, this.vertices)));
        return ret;
    }
}

export class Vertex {
    constructor(public id: string, public cost: number = 0) {};
}

export class Vertices {
    private verticesIds: Map<string, number> = new Map();
    private static sMaxVerticesInstances = 100;
    private verticesPool: Map<string, Vertex> = new Map();

    private appendInPool(vertex: Vertex) {
        if (this.verticesPool.size >= Vertices.sMaxVerticesInstances) {
            const keys = this.verticesPool.keys();
            for (let i = 0; i < this.verticesPool.size / 2; ++i)
                this.verticesPool.delete(keys.next().value);
        }
        this.verticesPool.set(vertex.id, vertex);
    }

    public addVertex(vertex: Vertex) {
        this.add(vertex.id, vertex.cost);
    }

    public add(id: string, cost: number) {
        this.verticesIds.set(id, cost);
    }

    public get(id: string): Vertex | undefined {
        let ret: Vertex | undefined = this.verticesPool.get(id);
        if (ret == undefined && this.verticesIds.has(id)) {
            ret = new Vertex(id);
            this.appendInPool(ret);
        }
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
 * Graph non orienté
 */
export class GraphNO {
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