/***
 * Integration test of graph implementation
 * 
 * Look at the execution time spend to create a complete graph
 * of N vertices.
 */

import { Vertices, Edges, Vertex } from "./tools/graph";

function testBig() {
    const N = 8000;
    let vertexNames: string[] = [];
    for (let i: number = 0; i < N; ++i)
        vertexNames.push(i.toString());
    console.log("start");
    console.time();
    let vertices = new Vertices();
    let edges = new Edges(vertices, true);
    for (const names of vertexNames) {
        vertices.add(names, 1);
    }
    vertices.foreach((vertex_a: Vertex) => {
        vertices.foreach((vertex_b: Vertex) => {
            edges.add(vertex_a.id, vertex_b.id, 1);
        })
    });
    console.timeEnd();
    console.log(vertices.size);
    console.log(edges.size);
    console.log(edges.neighboor("1"));
}

testBig();