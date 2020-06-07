/***
 * Integration test of graph implementation
 * 
 * Look at the execution time spend to create a complete graph
 * of N vertices.
 */

import {Vertices, Edges, Vertex } from "./tools/graph";

function test() {
    const N = 5000;
    let vertexNames: string[] = [];
    for (let i: number = 0; i < N; ++i)
        vertexNames.push(i.toString());
    console.log("start");
    console.time();
    let vertices = new Vertices();
    let edges = new Edges(vertices);
    for (const names of vertexNames) {
        vertices.add(names, 1);
        vertices.foreach((vertex: Vertex) => edges.add(names, vertex.id, 1));
    }
    const end = new Date().getMilliseconds();
    console.timeEnd();
    console.log(vertices.size);
}

test();