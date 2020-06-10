class Shape {
    /**
     * Construction of a shape
     * @param vertices List of vertices
     * @param edges List of edge Ai, Bi where Ai and Bi are the indexes of vertices
     */
    constructor(
        public readonly vertices: [number, number][],
        public edges: [number, number][]) {
        if (vertices.length < 3)
            throw new Error("There is minimu 3 points in a shape");
        if (edges.length < vertices.length)
        throw new Error("Invalid shape");
    }

    public getLines(): [number, number][] {
        let ret: [number, number][] = []
        for (const edge of this.edges)
            ret.push(Tools.getLine(
                this.vertices[edge[0]],
                this.vertices[edge[1]]));
        return ret;
    }
}

class Canvas {
    public shapes: Shape[] = []
    constructor(
        private readonly width: number,
        private readonly height: number) {}

    public isCutted(shape: Shape, a: number, b: number): boolean {
        let side: boolean = Tools.side(a, b, shape.vertices[0]) > 0;
        for (let i = 1; i < shape.vertices.length; ++i) {
            const s = Tools.side(a, b, shape.vertices[i]);
            if (side != (s > 0) && s != 0)
                return true;
        }
        return false;
    }

    /**
     * Cut a shape in multiple shapes with a linear function
     * f(x) = ax + b
     */
    public cutShape(shape: Shape, a: number, b: number) {
        let newShapes: Shape[] = [];
        let shapes: Map<Shape, [number, number][]> = new Map();
        if (this.isCutted(shape, a, b)) {
            // TODO
        }
    }
}

class Tools {
    /**
     * Get [a, b] as f(x) = ax + b from two points p1 and p2 of the line
     */
    static getLine(p1: [number, number], p2: [number, number]): [number, number] {
        const a = (p2[1] - p1[1]) / (p2[0] - p1[0]); 
        const b = p1[1] - a * p1[0];
        return [a, b];
    }

    static side(a: number, b: number, p: [number, number]): number {
        return p[1] - (a * p[0] + b);
    }
}
