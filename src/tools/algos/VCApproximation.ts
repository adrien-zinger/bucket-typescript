/**
 * L'apporximation du voyageur de commerce part du principe que le graphe est non orienté complet
 * 
 * De la on peut créer un arbre d'approximation et relier chacun des neuds
 * 
 */

import { GraphNO, Vertex} from "../graph";
import { prim } from "./ACM";

/**
 * Return a list of vertices ordered for vc
 */
export function approximate(input: GraphNO): Vertex[] {
    let vertices: Vertex[] = [];
    prim(input, (v: Vertex) => vertices.push(v));
    return vertices;
}
