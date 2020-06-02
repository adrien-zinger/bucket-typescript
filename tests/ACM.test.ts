import { GraphNO, Vertex, Edge} from "../src/tools/graph";
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
      let vertices: Vertex[] = [];
      let edges: Edge[] = [];
      for (let n of vertexNames)
        vertices.push(new Vertex(n));
      for (let e of edgesName)
        edges.push(new Edge(e[0], e[1], e[2]));
      let visited = '';
      const g = new GraphNO(vertices, edges);
      prim(g, vertex => visited += ' ' + vertex.id, 'a');
      visited = visited.substring(1);
      expect(visited).toEqual("a b c i f g h d e");

      // Test the weight while we have a list
      g.initMatrix();
      let retVertices: Vertex[] = [];
      visited.split(' ').forEach(element => retVertices.push(new Vertex(element)));
      expect(g.getTotalWeight(retVertices)).toEqual(26);
  });
});