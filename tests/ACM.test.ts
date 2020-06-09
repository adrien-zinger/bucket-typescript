import { Graph, Vertex, Vertices, Edges} from "../src/tools/graph";
import { prim } from "../src/tools/algos/ACM";

describe('Test ACM algorithms', () => {

  it('simple ACM test the prim function', () => {
      const vertexNames: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
      const edgesName: [string, string, number][] = [
          ['a', 'b', 4],
          ['a', 'h', 8],
          ['b', 'c', 8],
          ['b', 'h', 11],
          ['c', 'i', 2],
          ['c', 'f', 4],
          ['c', 'd', 7],
          ['d', 'f', 14],
          ['d', 'e', 9],
          ['e', 'f', 10],
          ['f', 'g', 2],
          ['g', 'i', 6],
          ['g', 'h', 1],
          ['h', 'i', 7]
      ];
      let vertices: Vertices = new Vertices();
      let edges: Edges = new Edges(vertices);
      for (let n of vertexNames)
        vertices.add(n[0], 0);
      for (let e of edgesName)
        edges.add(e[0], e[1], e[2]);
      let visited = '';
      const g = new Graph(vertices, edges);
      prim(new Set<string>(vertexNames),
        (vertexId: string) => {
          const e = edges.neighboor(vertexId);
          let ret: [string, number][] = [];
          e.forEach(t => ret.push([t.b.id, t.w]));       
          return ret;
        },
        vertex => visited += ' ' + vertex, 'a');
      visited = visited.substring(1);
      expect(visited).toEqual("a b h g f c i d e");

      // Test the weight while we have a list
      let retVertices: Vertex[] = [];
      visited.split(' ').forEach(element => retVertices.push(new Vertex(element)));
      expect(g.getTotalWeight(retVertices)).toEqual(33);
  });
});
