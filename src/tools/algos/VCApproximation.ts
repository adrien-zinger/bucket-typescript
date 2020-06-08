/**
 * L'apporximation du voyageur de commerce part du principe que le graphe est non orienté complet
 * 
 * De la on peut créer un arbre d'approximation et relier chacun des neuds
 * 
 */

import { Graph, Vertex} from "../graph";
import { prim } from "./ACM";

/**
 * Return a list of vertices ordered for vc
 */
export function approximate(input: Graph): Vertex[] {
    let vertices: Vertex[] = [];
    let setNames: Set<string> = new Set();
    input.vertices.foreach((v: Vertex) => setNames.add(v.id));
    prim(setNames,(vertexId: string) => {
        const e = input.edges.neighboor(vertexId);
        let ret: [string, number][] = [];
        e.forEach(t => ret.push([t.b.id, t.w]));
        return ret;
      },
      (vertexId: string) =>
        vertices.push(input.vertices.get(vertexId)!)
    );
    return vertices;
}
